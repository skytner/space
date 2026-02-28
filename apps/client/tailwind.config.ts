import sharedConfig from "@packages/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  ...sharedConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/react-ui/**/*.{js,ts,jsx,tsx}",
  ],
};