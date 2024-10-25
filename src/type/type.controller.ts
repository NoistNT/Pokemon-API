import { Controller, Get, Param } from '@nestjs/common';
import { TypeService } from './type.service';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  /**
   * Retrieves all Pokemon types from the database.
   *
   * @returns A promise resolving to an array of Type objects.
   * @throws {Error} If any error occurs during retrieval.
   */
  @Get()
  async findAll() {
    return await this.typeService.findAll();
  }

  /**
   * Retrieves a specific Pokemon type by its ID.
   *
   * @param {number} id - The unique identifier of the type to retrieve.
   * @returns A promise resolving to the fetched Type object.
   * @throws {NotFoundException} If the specified type is not found.
   * @throws {Error} If any other error occurs during retrieval.
   */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.typeService.findOne(id);
  }
}
