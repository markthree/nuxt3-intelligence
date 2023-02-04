# nuxt3-intelligence

`nuxt3` 智能工具集合

<br />

## Usage

### install

```shell
npm i nuxt3-intelligence
```

### Program

#### getStaticDepsFromNuxtConfig

```ts
import { getStaticDepsFromNuxtConfig } from 'nuxt3-intelligence'

const deps = getStaticDepsFromNuxtConfig()

deps // Get all static deps for modules and extends 
```

#### genPrerenderRoutesSync

```ts
import { genPrerenderRoutesSync, createDefaultGenPrerenderRoutesSyncOptions } from 'nuxt3-intelligence'

const defaultOptions = createDefaultGenPrerenderRoutesSyncOptions() // https://content.nuxtjs.org/ mode
const routes = genPrerenderRoutesSync(defaultOptions)

routes // Get all routes for nuxt content with cache
```

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
