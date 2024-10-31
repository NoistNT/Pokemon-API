import { createHttpException, handleError, validateEnvVariables } from '@/lib/utils';
import { Type, TypeApiResponse, createTypeSchema } from '@/schemas/type.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { SeedResponse } from './entities/seeder.entity';

@Injectable()
export class SeederService {
  constructor(@InjectModel('Type') private readonly typeModel: Model<Type>) {
    validateEnvVariables();
  }

  /**
   * Fetches type data from the provided URL, performs validation, and returns a Type object.
   *
   * @param {string} url The URL from which to fetch the type data.
   * @returns {Promise<Type>} A Promise that resolves to the validated Type object.
   * @throws {Error} If fetching the type data fails or if the fetched data fails validation.
   */
  private async getType(url: string): Promise<Type> {
    try {
      const { data }: AxiosResponse<Type> = await axios.get(url);
      const { name } = data;

      // Validate data against the defined Type schema
      const validatedData = createTypeSchema.safeParse({ name, url });

      if (!validatedData.success) {
        throw createHttpException(
          `Failed to validate type data: ${validatedData.error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return new this.typeModel(validatedData.data);
    } catch (error) {
      return handleError(error, 'Failed to fetch type data');
    }
  }

  /**
   * Retrieves type data from the API and returns an array of Type objects.
   *
   * @returns {Promise<Type[]>} A Promise that resolves to an array of Type objects.
   * @throws {Error} If fetching types data fails.
   */
  private async getTypesDataFromApi(): Promise<Type[]> {
    try {
      // Specify expected API response structure
      const { data }: AxiosResponse<TypeApiResponse> = await axios.get(`${process.env.BASE_URL}/type`);

      // Ensure results array and extract type urls
      const typeUrls = data.results.map((type) => type.url);

      // Use Promise.all for concurrent fetching and validation
      return await Promise.all(typeUrls.map((url) => this.getType(url)));
    } catch (error) {
      return handleError(error, 'Failed to fetch types data');
    }
  }

  /**
   * Seeds the database with types data if it's not already seeded.
   *
   * @returns {Promise<SeedResponse>} A Promise that resolves to a response object with status and message.
   * @throws {Error} If seeding types data fails.
   */
  async seed(): Promise<SeedResponse> {
    const session = await this.typeModel.startSession();
    session.startTransaction();

    try {
      const types = await this.getTypesDataFromApi();
      await this.typeModel.deleteMany({});
      await this.typeModel.insertMany(types);

      // Commit the transaction if successful
      await session.commitTransaction();

      return {
        status: HttpStatus.CREATED,
        message: 'Pokemon types seeded successfully',
      };
    } catch (error) {
      // Abort transaction if any error occurs
      await session.abortTransaction();
      const typedError = error as Error;
      throw new Error(`Failed to seed types data: ${typedError.message}`);
    } finally {
      // End the session regardless of success or failure
      session.endSession();
    }
  }
}
