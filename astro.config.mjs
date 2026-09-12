// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: 'shiki',
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  site:'https://voluxium.github.io',
  base:'/hub/'
});
