// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetAttributify, presetWebFonts } from "unocss";

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno(), presetIcons(), presetAttributify(), presetWebFonts()]
});
