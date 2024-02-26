import { Controller, Get } from '@nestjs/common';
import { SeedResponse } from './entities/seeder.entity';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  /**
   * Endpoint to trigger the seeding process using a GET request.
   * This will populate the database with initial or test data.
   *
   * @remarks
   * - Requires appropriate authorization to access.
   * - Typically used during initial setup, testing, or data reset.
   * - Consider alternative seeding mechanisms like CLI commands or environment variables.
   *
   * @returns {Promise<SeedResponse>} An object containing the status and message of the seeding process:
   * - status: 201 for success, other codes for failure.
   * - message: A human-readable message indicating the outcome of the seeding process.
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
