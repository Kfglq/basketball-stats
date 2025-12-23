// src/utils/config.ts
const {
  VITE_API_PROTOCOL: protocol = "http",
  VITE_API_HOST: host = "localhost",
  VITE_API_PORT: port = 80,
  VITE_API_PREFIX: prefix = "",
} = import.meta.env;

const api = `${protocol}://${host}${host==="localhost"?`:${port}`:""}${prefix}`;

export default {
  api,
};
