<a name="readme-top"></a>

<div align="center">
  <a href="https://pokewikiclient.vercel.app">
    <img src="assets/logo.webp" alt="PokeWiki Logo" width="500" height="200">
  </a>

**RESTful API** powering Pokewiki, a comprehensive Pokémon knowledge base

[Live Demo](https://pokewikiclient.vercel.app) •
[Report Bug](https://github.com/NoistNT/Pokemon-API/issues) •
[Request Feature](https://github.com/NoistNT/Pokemon-API/issues)

</div>

## About The Project

This API provides comprehensive access to Pokémon data:

### Features

- **Fetch Pokémon**: List all, by ID, or by name
- **Manage Pokémon**: Create, update, and delete Pokémon entries
- **Types**: Query all Pokémon types
- **Seeding**: Populate the database with types from PokeAPI

### Endpoints

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/pokemon`            | List all Pokémon        |
| GET    | `/pokemon/:id`        | Get Pokémon by ID       |
| GET    | `/pokemon/name/:name` | Get Pokémon by name     |
| POST   | `/pokemon`            | Create a new Pokémon    |
| PATCH  | `/pokemon/:id`        | Update a Pokémon        |
| DELETE | `/pokemon/:id`        | Delete a Pokémon        |
| GET    | `/type`               | List all types          |
| GET    | `/type/:id`           | Get type by ID          |
| POST   | `/seeder`             | Seed types from PokeAPI |

### Tech Stack

<div style="display: flex; gap: 8px; flex-wrap: wrap;">
  <img src="https://img.shields.io/badge/TypeScript-%233178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-%23633933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/NestJS-%23E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b?style=flat&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Mongoose-%23851125?style=flat&logo=mongoose&logoColor=white" alt="Mongoose">
  <img src="https://img.shields.io/badge/Zod-%233068ae?style=flat&logo=zod&logoColor=white" alt="Zod">
</div>

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/NoistNT/Pokemon-API.git

# Navigate to the project
cd Pokemon-API

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
BASE_URL=https://pokeapi.co/api/v2
CORS_ORIGIN=https://your-frontend.vercel.app
SEEDER_API_KEY=your_secure_api_key
TOTAL_POKEMONS=1281
PORT=3000
```

### Running the Server

```bash
# Development
pnpm start:dev

# Production
pnpm build && pnpm start:prod
```

### Seeding the Database

Before using the API, seed the types:

```bash
curl -X POST https://your-api.com/seeder \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_seeder_api_key"
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

- [LinkedIn](https://linkedin.com/in/ariel-piazzano)
- [Email](mailto:arielgnr23@gmail.com)
