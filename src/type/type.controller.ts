import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { TypeService } from './type.service';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  /**
   * Retrieve all Pokemon types.
   * @returns An array of all Pokemon types.
   */
  @Get()
  async findAll() {
    try {
      return await this.typeService.findAll();
    } catch (error) {
      const typedError = error as Error;
      throw new InternalServerErrorException(typedError.message);
    }
  }

  /**
   * Retrieve a specific Pokemon type by its ID.
   * @param id The ID of the type to retrieve.
   * @returns The type with the specified ID.
   * @throws NotFoundException if the requested type is not found.
   */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.typeService.findOne(id);
    } catch (error) {
      const typedError = error as Error;
      throw new InternalServerErrorException(typedError.message);
    }
  }
}
