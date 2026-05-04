import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        mid: "#888888",
        line: "#e8e8e8",
        bone: "#f5f4ef",
        decert: "#c0392b",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.08em",
      },
      borderRadius: {
        card: "6px",
      },
    },
  },
  plugins: [],
} satisfies Config;
