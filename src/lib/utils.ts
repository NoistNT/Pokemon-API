import { HttpException, HttpStatus } from '@nestjs/common';
import { URL } from 'url';

export const sanitizedString = (name: string) => name.trim().toLowerCase();

export function validateEnvVariables() {
  const { BASE_URL, TOTAL_POKEMONS } = process.env;
  if (!BASE_URL || !TOTAL_POKEMONS) {
    throw new HttpException(
      'Required environment variables are not defined',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // Validate BASE_URL
  try {
    const parsedUrl = new URL(BASE_URL);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('BASE_URL must use http or https protocol.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new HttpException(
      'BASE_URL is not a valid URL in environment variables or uses an invalid protocol.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // Validate TOTAL_POKEMONS
  const totalPokemonsNum = parseInt(TOTAL_POKEMONS, 10);
  if (isNaN(totalPokemonsNum) || totalPokemonsNum <= 0) {
    throw new HttpException('TOTAL_POKEMONS must be a positive integer.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const createHttpException = (message: string, status: HttpStatus): HttpException => {
  return new HttpException(message, status);
};

export const handleError = (error: unknown, defaultMessage: string) => {
  const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  throw createHttpException(defaultMessage, status);
};

export const isValidUrlForApi = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    if (!process.env.BASE_URL || !parsedUrl.href.startsWith(process.env.BASE_URL)) return false;
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};
