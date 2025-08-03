import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.ts";

const fullConfig = resolveConfig(tailwindConfig);

export const chartColors = fullConfig.theme?.colors?.chart as Record<string, string>;
