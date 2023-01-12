import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
	clearComments,
	readTextFile,
	lookUpNuxtConfig,
	getStaticDepsFromCode,
	getStaticDepsFromNuxtConfig
} from '../src/index'

describe('core', async () => {
	const cwd = fileURLToPath(
		new URL('./fixture', import.meta.url)
	)

	const nuxtConfigPath = lookUpNuxtConfig(cwd)

	const text = await readTextFile(nuxtConfigPath)

	it('lookUpNuxtConfig', () => {
		expect(nuxtConfigPath).toMatchInlineSnapshot(
			'"D:\\\\Code\\\\Work\\\\nuxt3-intelligence\\\\test\\\\fixture\\\\nuxt.config.ts"'
		)
	})

	it('clearComments', () => {
		expect(clearComments(text)).toMatchInlineSnapshot(`
			"import {} from 'mkdist'
			import {} from 'unbuild'

			import {} from '@markthree/utils'

			import {} from '@markthree/m-type-tools/is'


			export default {
				modules: [
					'./foo', 
					'path', 
					require('path'), 
					import('path'), 
					'@unocss/nuxt',
					'@vueuse/nuxt',
					'@nuxtjs/critters',
					'@nuxtjs/color-mode',
					'nuxt-simple-sitemap',
					'@nuxtjs/html-validator'
				],
				extends: '@nuxt-themes/docus'
			}
			"
		`)
	})

	it('getStaticDepsFromCode', async () => {
		const deps = getStaticDepsFromCode(text)

		expect(deps).toBeInstanceOf(Array)

		expect(deps).toMatchInlineSnapshot(`
			[
			  "mkdist",
			  "unbuild",
			  "@markthree/utils",
			  "@markthree/m-type-tools",
			]
		`)
	})

	it('getStaticDepsFromNuxtConfig', async () => {
		const deps = await getStaticDepsFromNuxtConfig(cwd)

		expect(deps).toBeInstanceOf(Array)

		expect(deps).toMatchInlineSnapshot(`
			[
			  "mkdist",
			  "unbuild",
			  "@markthree/utils",
			  "@markthree/m-type-tools",
			  "@nuxt-themes/docus",
			  "@unocss/nuxt",
			  "@vueuse/nuxt",
			  "@nuxtjs/critters",
			  "@nuxtjs/color-mode",
			  "nuxt-simple-sitemap",
			  "@nuxtjs/html-validator",
			]
		`)
	})
})
