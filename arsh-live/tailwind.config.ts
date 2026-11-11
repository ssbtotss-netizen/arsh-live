import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: { extend: { colors: { gold: "#e8c46a", ink: "#07070b", card: "#13131c", line: "#262636" } } },
} satisfies Config;
