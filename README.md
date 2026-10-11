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

All endpoints are public and require no API key.

The Mock API builder creates callable GET, POST, PUT, PATCH, and DELETE endpoints. Configure a custom response or a CRUD resource, then copy the API base URL and append your endpoint path. Scenarios can select responses by query parameters, request headers, or JSON body fields.

Definitions are compressed into the URL. Nothing is saved to a database or browser storage, and no mock request history is retained by the server. CRUD writes simulate responses; later reads return the original seeded dataset. Copy a new URL after editing the configuration or regenerating data. Shared links have no expiry while the host supports their definition version; generator upgrades can change the generated values.

Mock definitions allow up to 20 endpoints/resources, 10 scenarios per endpoint, 6 KiB of encoded configuration, and 64 KiB when decompressed. The existing `POST /api/v1/mock/pagination` endpoint remains available.
