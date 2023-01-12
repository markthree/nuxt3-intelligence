import { existsSync } from 'fs'
import { resolve } from 'path'
import { readFile } from 'fs/promises'
import { cwd as _cwd } from 'process'

export async function readTextFile(path: string) {
	const buffer = await readFile(path)
	return buffer.toString()
}

export async function getDepsFromNuxtConfig(cwd = _cwd()) {
	const configPath = lookUpFile([
		resolve(cwd, 'nuxt.config.ts'),
		resolve(cwd, 'nuxt.config.js')
	])

	if (!configPath) {
		throw new Error('nuxt config file does not exist')
	}

	const text = await readTextFile(configPath)

	const _modules = matchArrayFromText('modules', text)

	const _extends = matchArrayFromText('extends', text)

	const deps = _modules.concat(_extends)

	return deps
}

export function lookUpFile(paths: string[]) {
	return paths.find(path => existsSync(path))
}

export function toRealArray(str: string) {
	return str.replace(/['"\r\n\t\s]/g, '').split(',')
}

export function matchArrayFromText(
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

	return toRealArray(matchArray)
}
