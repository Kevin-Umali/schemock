# Schemock

Generate fake JSON, CSV, SQL, text templates, and paginated API responses.

```sh
bun install
cd client && bun install
cd ..
bun run dev:all
```

Open [Schemock](http://localhost:5173), the [user guide](http://localhost:5173/docs), or the [API reference](http://localhost:3000/api/v1/ui).

Generated emails always use the reserved `example.test` domain.

To require a bearer token for generation and mock API requests, set `SCHEMOCK_API_KEY` in the server environment. Send it in the `Authorization: Bearer …` header when calling those endpoints. Leave the variable unset to keep them public. Missing or invalid credentials return `401 Unauthorized`.
