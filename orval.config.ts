import { defineConfig } from "orval";
export default defineConfig({
  petstore: {
    output: {
      mode: "single",
      target: "app/gen/api.ts",
      schemas: "app/gen/models",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "app/lib/api-client.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: "http://localhost:3000/openapi/v1.json",
    },
  },
});
