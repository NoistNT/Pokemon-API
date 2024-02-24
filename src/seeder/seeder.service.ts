import { Type } from '@/schemas/type.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { Model } from 'mongoose';
import { SeedResponse } from './entities/seeder.entity';
dotenv.config();

@Injectable()
export class SeederService {
  constructor(@InjectModel('Type') private readonly typeModel: Model<Type>) {}

  /**
   * Fetches type data from the provided URL.
   *
   * @param {string} url The URL from which to fetch the type data.
   * @returns {Promise<Type>} A Promise that resolves to the fetched type data.
   * @throws {Error} If fetching the type data fails.
   */
  async getType(url: string): Promise<Type> {
    try {
      const { data }: AxiosResponse<Type> = await axios.get(url);
      return { ...data, url };
    } catch (error) {
      const typedError = error as Error;
      throw new Error(
        `Failed to fetch Pokemon type data: ${typedError.message}`,
      );
    }
  }

  /**
   * Retrieves types data from the API.
   *
   * @returns {Promise<Type[]>} A Promise that resolves to an array of types data.
   * @throws {Error} If fetching types data fails.
   */
  async getTypesDataFromApi(): Promise<Type[]> {
    try {
      const { BASE_URL } = process.env;
      if (!BASE_URL) {
        throw new Error('BASE_URL not defined in environment variables');
      }

      const { data }: AxiosResponse<{ results: Type[] }> = await axios.get(
        `${BASE_URL}/type`,
      );

      return await Promise.all(
        data.results.map((type) => this.getType(type.url)),
      );
    } catch (error) {
      const typedError = error as Error;
      throw new Error(
        `Failed to fetch Pokemon types data from API: ${typedError.message}`,
      );
    }
  }

  /**
   * Seeds the database with types data if it's not already seeded.
   *
   * @returns {Promise<SeedResponse>} A Promise that resolves to an object containing the status and message of the seed operation.
   * @throws {Error} If seeding types data fails.
   */
  async seed(): Promise<SeedResponse> {
    try {
      const typesDB = await this.typeModel.find();

      if (typesDB.length) {
        return {
          status: 300,
          message: 'Pokemon types already seeded',
        };
      }

      const types = await this.getTypesDataFromApi();
      await this.typeModel.insertMany(types);
      return {
        status: 201,
        message: 'Pokemon types seeded successfully',
      };
    } catch (error) {
      const typedError = error as Error;
      throw new Error(
        `Failed to seed Pokemon types data: ${typedError.message}`,
      );
    }
  }
}
