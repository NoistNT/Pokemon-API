import { z } from 'zod';

export const createPokemonSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(30).trim().toLowerCase(),
  image: z.string().url().trim().optional(),
  hp: z.number().int().min(1).max(999).default(1),
  attack: z.number().int().min(1).max(999).default(1),
  defense: z.number().int().min(1).max(999).default(1),
  speed: z.number().int().min(1).max(999).default(1),
  height: z.number().int().min(1).max(999).default(1),
  weight: z.number().int().min(1).max(999).default(1),
  userCreated: z.boolean().default(true),
  type: z
    .array(z.object({ name: z.string() }))
    .min(1)
    .max(2),
});

export type CreatePokemonDto = z.infer<typeof createPokemonSchema>;

export const updatePokemonSchema = createPokemonSchema.partial();

export type UpdatePokemonDto = z.infer<typeof updatePokemonSchema>;
