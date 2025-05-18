# Schemock: Schema-Based Mock Data Generator

## Overview

Schemock is a powerful API for generating mock data based on a specified schema. It allows you to create complex data structures with nested properties and arrays, which can be customized using various schema properties.

**For more detailed documentation, visit [Schemock Documentation](https://mobile-kirby-summerwinter-b02fe5c1.koyeb.app/api/v1/ui).**

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Examples](#examples)
5. [Code Quality](#code-quality)
6. [Deployment](#deployment)
7. [Contributing](#contributing)

## Features

### Schema Properties

| Property | Description                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| items    | Define an array of items with a schema for each item.                                                           |
| count    | Specify the number of items to generate in the array. If omitted, the array will be empty and become an object. |
| locale   | Set the locale for generating data. Defaults to the standard locale if omitted.                                 |

## Installation

To install Schemock, use the following commands:

```bash
# Clone the repository
git clone https://github.com/Kevin-Umali/schemock.git

# Navigate to the project directory
cd schemock

# Install dependencies
bun install
```

## Usage

After installation, you can start the server and use the API endpoints to generate mock data.

### Start the server

```bash
bun dev
```

### Example Request

Using `curl` to generate mock data:

```bash
curl -X POST http://localhost:3000/api/v1/generate/json \
     -H "Content-Type: application/json" \
     -d '{
           "schema": {
             "name": "string",
             "email": "email"
           },
           "locale": "en",
           "count": 5
         }'
```

## Example Explained

### Simple Example:

Generates a single object with name and email properties.

```json
{
  "schema": {
    "name": "person.firstName",
    "email": "internet.email"
  },
  "count": 1
}
```

### Locale Example

This example demonstrates how to use the `locale` property to specify the locale for generating data. In this case, the locale is set to French (`fr`).

```json
{
  "schema": {
    "name": "person.firstName",
    "email": "internet.email"
  },
  "count": 1,
  "locale": "fr"
}
```

### Nested Example:

Generates a single object with nested properties, including a nested address object.

```json
{
  "schema": {
    "user": {
      "name": "person.firstName",
      "email": "internet.email",
      "address": {
        "street": "location.streetAddress",
        "city": "location.city",
        "country": "location.country"
      }
    }
  },
  "count": 1
}
```

### Array of an object Example:

Generates an object with an employees array containing three objects, each with name and email properties.

```json
{
  "schema": {
    "employees": {
      "items": {
        "name": "person.firstName",
        "email": "internet.email"
      },
      "count": 3
    }
  },
  "count": 1
}
```

### Array of a string Example:

Generates a string array containing three random first names.

```json
{
  "schema": {
    "employees": {
      "items": "person.firstName",
      "count": 3
    }
  },
  "count": 1
}
```

### Faker Arguments Example:

This example demonstrates how to pass arguments to the Faker data generator functions directly within the schema. In this case, we are customizing the `internet.email` function by passing a `firstName` argument.

```json
{
  "schema": {
    "user": {
      "name": "person.firstName",
      "email": "internet.email({ firstName: 'John' })"
    }
  },
  "count": 1
}
```

### Complex Nested Example:

Generates a complex object representing a company structure, including nested departments and employees with skills. The count property specifies how many items to generate at each level.

```json
{
  "schema": {
    "company": {
      "name": "company.name",
      "address": {
        "street": "location.streetAddress",
        "city": "location.city",
        "country": "location.country"
      },
      "departments": {
        "items": {
          "name": "commerce.department",
          "employees": {
            "items": {
              "firstName": "person.firstName",
              "lastName": "person.lastName",
              "email": "internet.email",
              "hireDate": "date.recent",
              "skills": {
                "items": {
                  "name": "lorem.word",
                  "proficiency": "datatype.number"
                },
                "count": 2
              }
            },
            "count": 2
          }
        },
        "count": 2
      }
    }
  },
  "count": 1
}
```

## Code Quality

Schemock follows industry best practices for code quality and maintainability:

### Architecture

- **Modular Design**: The codebase is organized into focused modules with clear responsibilities
- **Separation of Concerns**: Business logic, data handling, and API endpoints are properly separated
- **Type Safety**: Strict TypeScript typing throughout the codebase for better reliability

### Coding Standards

- **SonarQube Compliance**: Code follows SonarQube guidelines for maintainability and reliability
- **Early Returns**: Complex conditionals are simplified using early returns and guard clauses
- **Functional Patterns**: Leverages functional programming techniques like map/filter/reduce where appropriate
- **Modern JavaScript**: Uses optional chaining, nullish coalescing, and other modern JS features

### Complex Data Handling

- **Object Flattening**: Ability to flatten nested objects for CSV and SQL generation
- **Readable Formatting**: Complex objects are automatically formatted into human-readable paragraphs
- **Consistent Output**: Ensures consistent output format across different data types
- **Type Conversion**: Intelligent type conversion for different output formats

### Testing

- **Unit Tests**: Comprehensive test coverage for core functionality
- **Integration Tests**: API endpoints are tested with realistic scenarios
- **Test Utilities**: Dedicated test helpers and utilities for consistent testing

### Documentation

- **JSDoc Comments**: All functions and modules are documented with JSDoc comments
- **API Documentation**: OpenAPI/Swagger documentation for all endpoints
- **Code Examples**: Practical examples for common use cases

## Deployment

You can deploy Schemock to various platforms with the following buttons:

### Deploy to Koyeb

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&repository=https://github.com/Kevin-Umali/schemock)

### Deploy to Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Kevin-Umali/schemock)

### Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Kevin-Umali/schemock)

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Kevin-Umali/schemock)

### Deploy to Vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Kevin-Umali/schemock)

### Other Platforms

For platforms that do not have a direct deploy button, you can follow their respective deployment guides:

- **Fly.io:** Follow the [Fly.io deployment guide](https://fly.io/docs/app-guides/continuous-deployment/) to deploy your application.
- **Adaptable.io:** Check out the [Adaptable.io documentation](https://adaptable.io/docs/getting-started) for deployment instructions.
- **Zeabur:** Refer to the [Zeabur deployment guide](https://zeabur.com/docs) to deploy your application.
- **Glitch:** Import your project into Glitch by visiting [Glitch Import](https://glitch.com/edit/#!/import/github/Kevin-Umali/schemock).

### Deploy with Docker

You can also deploy using Docker. Make sure you have Docker installed, then use the following commands:

```bash
# Build the Docker image
docker build -t schemock .
## or
bun run docker:build

# Run the Docker container
docker run -p 3000:3000 schemock
## or
bun run docker:up
```
