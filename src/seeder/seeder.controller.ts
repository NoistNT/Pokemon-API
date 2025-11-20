import { Controller, Post, Headers, ForbiddenException } from '@nestjs/common';
import { SeedResponse } from './entities/seeder.entity';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  /**
   * Endpoint to trigger the seeding process using a POST request.
   * This will populate the database with initial or test data.
   *
   * @remarks
   * - Requires a valid 'x-api-key' header for authorization.
   * - Typically used during initial setup, testing, or data reset.
   * - Consider alternative seeding mechanisms like CLI commands or environment variables.
   *
   * @param {string} apiKey - The API key from the 'x-api-key' header.
   * @returns {Promise<SeedResponse>} An object containing the status and message of the seeding process:
   * - status: 201 for success, other codes for failure.
   * - message: A human-readable message indicating the outcome of the seeding process.
   * @throws {ForbiddenException} If the provided API key is invalid.
   */
  @Post()
  async seed(@Headers('x-api-key') apiKey: string): Promise<SeedResponse> {
    if (apiKey !== process.env.SEEDER_API_KEY) throw new ForbiddenException('Invalid API Key');

    await this.seederService.seed();

    return {
      status: 201,
      message: 'Types seeded successfully',
    };
  }
}
