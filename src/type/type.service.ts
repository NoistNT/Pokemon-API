import { Type } from '@/schemas/type.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TypeService {
  constructor(@InjectModel('Type') private readonly typeModel: Model<Type>) {}

  /**
   * Retrieves all Type instances from the database asynchronously.
   *
   * @remarks
   * - Excludes internal fields (`createdAt`, `updatedAt`, `__v`) for conciseness.
   * - Includes only essential properties (`_id`, `name`, `url`).
   * - Throws an informative error if retrieval fails.
   *
   * @returns {Promise<Type[]>} A promise resolving to an array of Type objects.
   */
  async findAll(): Promise<Type[]> {
    try {
      return await this.typeModel.find().select('_id name url');
    } catch (error) {
      const typedError = error as Error;
      throw new Error(
        `Failed to retrieve Pokemon types list from the database: ${typedError.message}`,
      );
    }
  }

  /**
   * Finds a specific Type instance by its ID.
   *
   * @remarks
   * - Excludes internal fields (`createdAt`, `updatedAt`, `__v`) for conciseness.
   * - Includes only essential properties (`_id`, `name`, `url`).
   * - Throws a `NotFoundException` if the type is not found.
   * - Throws an informative error if retrieval fails.
   *
   * @param {number} id - The unique identifier of the type to find.
   * @returns {Promise<Type>} A promise resolving to the fetched Type object.
   */
  async findOne(id: number): Promise<Type> {
    try {
      const type = await this.typeModel
        .findOne({ _id: id })
        .select('_id name url');

      if (!type) {
        throw new Error(`Type with id ${id} not found`);
      }

      return type;
    } catch (error) {
      const typedError = error as Error;
      throw new Error(
        `Failed to retrieve the Pokemon type from the database: ${typedError.message}`,
      );
    }
  }
}
