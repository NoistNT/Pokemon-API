import { Controller, Get } from '@nestjs/common';
import { SeedResponse } from './entities/seeder.entity';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  /**
   * Endpoint to trigger the seeding process.
   * This will populate the database with initial or test data.
   * @returns {Promise<SeedResponse>} An object containing the status and message of the seeding process.
   */
  @Get()
  async seed(): Promise<SeedResponse> {
    await this.seederService.seed();
    return {
      status: 201,
      message: 'Types seeded successfully',
    };
  }
}
