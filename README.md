# Schema Properties

| Property | Description                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| items    | Add this property if you want to define an array of items. The items property should contain the schema definition for each item in the array. |
| count    | Add this property under items to specify how many items should be generated in the array. If omitted, the array will be empty.                 |
| locale   | Add this property to specify the locale for generating data. If omitted, the default locale will be used.                                      |

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

````json
{
  "schema": {
    "name": "person.firstName",
    "email": "internet.email"
  },
  "count": 1,
  "locale": "fr"
}

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
````

### Array Example:

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
