import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import options from './kb.config.js';
export default defineConfig({ plugins: [sveltekit(options)] });
