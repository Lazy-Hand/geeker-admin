// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetAttributify, presetWebFonts, SourceCodeTransformer } from "unocss";
import transformerAttributifyJsx from "@unocss/transformer-attributify-jsx";
export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno(), presetIcons(), presetAttributify(), presetWebFonts()],
  transformers: [
    transformerAttributifyJsx() as unknown as SourceCodeTransformer // <--
  ]
});
