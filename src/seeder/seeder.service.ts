import { Type, TypeApiResponse, createTypeSchema } from '@/schemas/type.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { SeedResponse } from './entities/seeder.entity';

@Injectable()
export class SeederService {
  constructor(@InjectModel('Type') private readonly typeModel: Model<Type>) {}

  /**
   * Fetches type data from the provided URL and performs validation.
   *
   * @param {string} url The URL from which to fetch the type data.
   * @returns {Promise<Type>} A Promise that resolves to the fetched and validated type data.
   * @throws {Error} If fetching the type data fails or if the fetched data fails validation.
   */
  async getType(url: string): Promise<Type> {
    try {
      const { data }: AxiosResponse<Type> = await axios.get(url);
      const validatedData = createTypeSchema.safeParse(data);

      if (!validatedData.success) {
        throw new Error(
          `Failed to validate type data: ${validatedData.error.message}`,
        );
      }

      return new this.typeModel(validatedData.data);
    } catch (error) {
      const typedError = error as Error;
      throw new Error(`Failed to fetch type data: ${typedError.message}`);
    }
  }

  /**
   * Retrieves types data from the API.
   *
   * @returns {Promise<Type[]>} A Promise that resolves to an array of types data.
   * @throws {Error} If fetching types data fails.
   */
  async getTypesDataFromApi(): Promise<Type[]> {
    const { BASE_URL } = process.env;
    if (!BASE_URL) {
      throw new Error('BASE_URL not defined in environment variables');
    }

    try {
      const { data }: AxiosResponse<TypeApiResponse> = await axios.get(
        `${BASE_URL}/type`,
      );

      return await Promise.all(
        data.results.map((type) => this.getType(type.url)),
      );
    } catch (error) {
      const typedError = error as Error;
      throw new Error(`Failed to fetch types data: ${typedError.message}`);
    }
  }

  /**
   * Seeds the database with types data if it's not already seeded.
   *
   * @returns {Promise<SeedResponse>} A Promise that resolves to an object containing the status and message of the seed operation.
   * @throws {Error} If seeding types data fails.
   */
  async seed(): Promise<SeedResponse> {
    const session = await this.typeModel.startSession();
    session.startTransaction();

    try {
      const types = await this.getTypesDataFromApi();
      await this.typeModel.deleteMany({});
      await this.typeModel.insertMany(types);
      await session.commitTransaction();

      return {
        status: 201,
        message: 'Pokemon types seeded successfully',
      };
    } catch (error) {
      await session.abortTransaction();
      const typedError = error as Error;
      throw new Error(`Failed to seed types data: ${typedError.message}`);
    } finally {
      session.endSession();
    }
  }
}
