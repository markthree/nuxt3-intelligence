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
