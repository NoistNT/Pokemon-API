import { HttpException, HttpStatus } from '@nestjs/common';

export const sanitizedString = (name: string) => {
  return name.trim().toLowerCase();
};

export function validateEnvVariables() {
  const { BASE_URL, TOTAL_POKEMONS } = process.env;
  if (!BASE_URL || !TOTAL_POKEMONS) {
    throw new HttpException(
      'Required environment variables are not defined',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export const createHttpException = (message: string, status: HttpStatus): HttpException => {
  return new HttpException(message, status);
};

export const handleError = (error: unknown, defaultMessage: string) => {
  const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  throw createHttpException(defaultMessage, status);
};
