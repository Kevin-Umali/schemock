# Schemock: Schema-Based Mock Data Generator

## Overview

Schemock is a powerful API for generating mock data based on a specified schema. It allows you to create complex data structures with nested properties and arrays, which can be customized using various schema properties. This project is organized into two primary folders: `client` and `server`.

---

## Project Structure

- **client/**: This folder contains the front-end client for interacting with the Schemock API. It allows users to define and visualize schemas, configure mock data generation options, and view generated mock data in a user-friendly interface.

- **server/**: This folder contains the back-end server implementation for Schemock. The server is responsible for processing schema definitions, generating mock data, and providing an API endpoint for client applications to interact with the data generation engine.

---

## Features

- **Schema-Based Mock Data Generation**: Define complex data structures, including nested objects and arrays, using a simple schema definition.
- **Customizable Data Properties**: Tailor mock data with various properties and constraints defined in the schema.
- **Client-Server Architecture**: The client allows for user interaction, while the server manages data generation and API handling.

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/schemock.git
   cd schemock
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the server:

   ```bash
   cd server
   npm start
   ```

4. Run the client:
   ```bash
   cd ../client
   npm start
   ```

---

## Usage

Once the client and server are running, open the client in your browser to define schemas and generate mock data through an intuitive interface. The client interacts with the server API to generate mock data based on your schema specifications.

---

## Contributing

We welcome suggestions and contributions from the community. If you have ideas for improvements or new features, please feel free to suggest them. You can also contribute by adding new features or fixing issues.

To make a suggestion or add a new feature, please:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and commit them with clear messages.
4. Open a pull request to the main repository.

We appreciate your contributions and look forward to collaborating with you!

---

Happy mocking with Schemock!
