import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { getDepsFromNuxtConfig } from '../src/index'

describe('deps', () => {
	const cwd = fileURLToPath(
		new URL('./fixture', import.meta.url)
	)
	it('getDepsFromNuxtConfig', async () => {
		expect(await getDepsFromNuxtConfig(cwd))
			.toMatchInlineSnapshot(`
			[
			  "@unocss/nuxt",
			  "@vueuse/nuxt",
			  "@nuxtjs/critters",
			  "@nuxtjs/color-mode",
			  "nuxt-simple-sitemap",
			  "@nuxtjs/html-validator",
			  "@nuxt-themes/docus",
			]
		`)
	})
})
