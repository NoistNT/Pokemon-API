<a name="readme-top"></a>

<br />

<div align="center">
 <a href="https://pokewikiclient.vercel.app">
  <img src="assets/logo.webp" alt="PokeWiki Logo" width="500" height="200">
 </a>

<h1 align="center">Pokewiki</h1>

<p align="center">
  An awesome RESTful API powering Pokewiki, a comprehensive Pokémon knowledge base!
  <br />
  <a href="https://pokeapi-7tx2.onrender.com/">View Demo</a>
  ·
  <a href="https://github.com/NoistNT/Pokemon-API/issues">Report Bug</a>
  ·
  <a href="https://github.com/NoistNT/Pokemon-API/issues">Request Feature</a>
 </p>

</div>

## About The Project

<br/>

This **RESTful API** provides comprehensive access to Pokémon data, empowering developers to:

**1. Fetch Pokémon:**

- **List All:** Retrieve a comprehensive list of all available Pokémon.
- **By Name:** Search for a specific Pokémon by providing its name.
- **By ID:** Access data for a particular Pokémon using its unique identifier.

**2. Manage Pokémon (CRUD Operations):**

- **Create:** Add a new Pokémon to the database, adhering to the specified data format.
- **Update:** Modify existing Pokémon data, providing the updated information.
- **Remove:** Delete a Pokémon from the database by its ID.

**Technical Specifications:**

- **Framework:** NestJS
- **Programming Language:** TypeScript
- **Database:** MongoDB
- **ORM:** Mongoose
- **Data Validation:** Zod
- **Endpoints:**

| Method | URL            | Description                      |
| ------ | -------------- | -------------------------------- |
| GET    | /pokemon       | Retrieves a list of all Pokémon. |
| GET    | /pokemon/:id   | Fetches a Pokémon by ID.         |
| GET    | /pokemon/:name | Searches for a Pokémon by name.  |
| POST   | /pokemon       | Creates a new Pokémon.           |
| PUT    | /pokemon/:id   | Updates an existing Pokémon.     |
| DELETE | /pokemon/:id   | Deletes a Pokémon by ID.         |

</br>

**Data Validation:**

This API employs Zod for robust data validation. Developers must adhere to the specified data format when creating, updating, or deleting Pokémon.

## Built With

[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-green.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/Nest.js-red.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-red.svg?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Zod](https://img.shields.io/badge/Zod-blue.svg?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

## Getting Started

Follow these steps to set up your local development environment:

### Prerequisites

- Node.js and npm (or pnpm, yarn) installed on your system.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NoistNT/Pokemon-API.git
   ```

2. Install Dependencies
   <br/>
   <br/>
   npm
   ```sh
   npm install
   ```
   pnpm
   ```sh
   pnpm install
   ```
   yarn
   ```sh
   yarn install
   ```
3. Run server
   <br/>
   <br/>
   ```sh
   npm start
   ```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- CONTACT -->

## Contact

[![LinkedIn][linkedin-shield]][linkedin-url] [![Gmail][gmail-shield]][gmail-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/ariel-piazzano
[product-screenshot]: https://github.com/NoistNT/Pokemon-Client/assets/104594670/4f6ffde7-7939-4abe-9690-df6ce88b84e5
[gmail-shield]: https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white
[gmail-url]: mailto:arielgnr23@gmail.com
