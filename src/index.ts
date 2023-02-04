import { sync } from 'fast-glob'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { cwd as _cwd } from 'node:process'
import { readFile } from 'node:fs/promises'
import { builtinModules } from 'node:module'
import { createFsComputedSync } from 'file-computed'

export async function readTextFile(path: string) {
	const buffer = await readFile(path)
	return buffer.toString()
}

export async function getStaticDepsFromNuxtConfig(
	cwd = _cwd()
) {
	const configPath = lookUpNuxtConfig(cwd)

	const text = clearComments(await readTextFile(configPath))

	const _normal = getStaticDepsFromCode(text) as string[]

	const _modules = matchStringArrayFromText('modules', text)

	const _extends = matchStringArrayFromText('extends', text)

	const deps = [
		...new Set(_normal.concat(_extends, _modules))
	]

	return filterNpmDeps(deps)
}

export function lookUpFile(paths: string[]) {
	return paths.find(path => existsSync(path))
}

export function lookUpNuxtConfig(cwd = _cwd()) {
	const configPath = lookUpFile([
		resolve(cwd, 'nuxt.config.ts'),
		resolve(cwd, 'nuxt.config.js')
	])

	if (!configPath) {
		throw new Error('nuxt config file does not exist')
	}

	return configPath
}

export function toRealStringArray(str: string) {
	return str
		.replace(/[\r\n\t\s]/g, '')
		.split(',')
		.filter(s => /^['"]/.test(s))
		.map(s => s.replace(/['"]/g, ''))
}

export function matchStringArrayFromText(
	key: string,
	text: string
) {
	const [matchString] =
		text.match(
			new RegExp(`(?<=${key}:.*['"])[\\w\\W]*(?=['"])`)
		) || []

	if (matchString) {
		return [matchString]
	}

	const [matchArray] =
		text.match(
			new RegExp(`(?<=${key}:.*\\[)[\\w\\W]*?(?=\\])`)
		) || []

	if (!matchArray) {
		return []
	}

	return toRealStringArray(matchArray)
}

export function filterNpmDeps(deps: string[]) {
	return deps.filter(dep => {
		const isLocal = /^~\/|\.\/|\.\.\//.test(dep)
		if (isLocal) {
			return false
		}

		const isNodeNuiltinModules =
			builtinModules.includes(dep)

		return !isNodeNuiltinModules
	})
}

export function clearComments(code: string) {
	return code.replace(/\/\/.*|\/\*[\w\W]*?\*\//g, '')
}

export function getStaticDepsFromCode(code: string) {
	const deps = code.match(/(?<=from\s+?['"]).*?(?=['"])/g)
	if (!deps) {
		return []
	}
	return deps.map(dep => {
		if (!dep.startsWith('@')) {
			return dep
		}
		const [user, pkg] = dep.split('/')
		return `${user}/${pkg}`
	})
}

interface GenPrerenderRoutesSyncOptions {
	cachePath?: string
	source: string
	deps: Array<string> | string
	replace(s: string): string
}

export function genPrerenderRoutesSync(
	options: GenPrerenderRoutesSyncOptions
) {
	const { cachePath, source, deps, replace } = options

	const FC = createFsComputedSync({
		cachePath
	})

	return FC(deps, () => {
		return sync(source, {
			onlyFiles: true
		}).map(v => replace(v))
	})
}

export function createDefaultGenPrerenderRoutesSyncOptions(
	override: Partial<GenPrerenderRoutesSyncOptions> = {}
): GenPrerenderRoutesSyncOptions {
	return {
		deps: './conetnt',
		source: './content',
		replace(s: string) {
			return s
				.replace('./content', '')
				.replace(/\.md/, '')
				.replace(/index$/, '')
				.replace(/\d\./g, '')
		},
		...override
	}
}
