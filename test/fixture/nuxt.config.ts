import {} from 'mkdist'
import {} from 'unbuild'
// @ts-ignore
import {} from '@markthree/utils'
// @ts-ignore
import {} from '@markthree/m-type-tools/is'

/**
 * nuxt config
 */
export default {
	modules: [
		'./foo', // local module
		'path', // node builtinModules
		require('path'), // dynamic import
		import('path'), // dynamic import
		'@unocss/nuxt',
		'@vueuse/nuxt',
		'@nuxtjs/critters',
		'@nuxtjs/color-mode',
		'nuxt-simple-sitemap',
		'@nuxtjs/html-validator'
	],
	extends: '@nuxt-themes/docus'
}
