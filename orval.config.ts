import { defineConfig } from "orval";
export default defineConfig({
  petstore: {
    output: {
      mode: "single",
      target: "app/gen/api.ts",
      schemas: "app/gen/models",
      client: "react-query",
    },
    input: {
      target: "http://localhost:3000/openapi/v1.json",
    },
  },
});
