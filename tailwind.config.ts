import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#000000",
        signal: "#FF4500",
      },
      boxShadow: {
        "soft-signal": "0 18px 40px rgba(255, 69, 0, 0.24)",
        "card-soft": "0 12px 30px rgba(0, 0, 0, 0.06)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(255,69,0,0.12)",
          },
          "50%": {
            boxShadow: "0 0 26px 4px rgba(255,69,0,0.45)",
          },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
