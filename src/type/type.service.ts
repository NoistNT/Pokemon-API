import { Type } from '@/schemas/type.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TypeService {
  constructor(@InjectModel('Type') private readonly typeModel: Model<Type>) {}

  /**
   * Retrieves all instances of Type from the database asynchronously.
   *
   * @returns {Promise<Type[]>} A Promise that resolves to an array of Type instances.
   * @throws {Error} If an error occurs while querying the database.
   */
  async findAll(): Promise<Type[]> {
    try {
      return await this.typeModel.find().select('-_id id name url');
    } catch (error) {
      const typedError = error as Error;
      throw new Error(
        `Failed to retrieve Pokemon types list from the database: ${typedError.message}`,
      );
    }
  }

  /**
   * Finds a type by its id property.
   *
   * @param {number} id The unique identifier of the type to find.
   * @returns {Promise<Type>} A Promise that resolves to the found type.
   * @throws {NotFoundException} If the specified type is not found.
   * @throws {Error} If the specified type is not found or an error occurs while querying the database.
   */
  async findOne(id: number): Promise<Type> {
    try {
      const type = await this.typeModel
        .findOne({ id })
        .select('-_id id name url');
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
