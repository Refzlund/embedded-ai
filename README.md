# SvelteKit + Electron


## Developing

Developed using [pnpm](https://pnpm.io)

<br/>

### Electron side of things

In `src/electron` we have the main modules.
- Creating main window
- Creating tray icon
- Adding listeners

`./app-actions` are split modules that brings functionality to
*electron.js*.
- Toggling the visiblity of the application
- Loading vite for the development

`./request-actions` are like requests to a server, in this case the `electron.js` process.<br/>
From SvelteKit, we can call the functions and pass data back and forth.

Think of electron.js as the "server" and SvelteKit as the "browser".<br/>
This was needed, as `fs` wasn't available in Vite, and so communication back and forth was required.<br/>
It has been written to be type-safe.

Modules are applied
```ts
// src/electron/request-actions/index.cts
import { fsRead, fsWrite } from './fs.cjs'

export type Modules = ModuleRecord<{
	'fsRead': typeof fsRead
	'fsWrite': typeof fsWrite
}>
```

> **Note**<br> 
> `'fsRead': typeof fsRead` key and import statement has to be the same.

And can be accessed on the SvelteKit application:
```ts
const { status, body } = await electron.requestAction({
	type: 'fsRead',
	body: {
		relativePath: './settings.json'
	}
})
```

Files are relative to `~/.embedded-ai/...`, where `.embedded-ai` can be changed in the settings `src/electron/app-store.cts`

<br/>

### SvelteKit

SvelteKit uses the `static-adapter`, meaning there is no server.<br/>
So it works like you'd expect it to work client-side wise.

Access to things like `process` or `fs` are lmited from my experience.

#### Libraries
- [pug]() compiles pug-template into html-markup using [svelte-preprocess](https://www.npmjs.com/package/svelte-preprocess)
- [sass](https://www.npmjs.com/package/sass) compiles scss to css using [svelte-preprocess](https://www.npmjs.com/package/svelte-preprocess)
- [svelte-awesome-pug](https://www.npmjs.com/package/svelte-awesome-pug) to extend pugs capabilities within Svelte
- [@floating-ui/core](https://www.npmjs.com/package/@floating-ui/core) is the library used for any popovers
- [svelte-floating-ui](https://www.npmjs.com/package/svelte-floating-ui) is an awesome package to apply *floating-ui* in Svelte
- [scss-color-var](https://npmjs.com/package/scss-color-var) maintains the color scheme throughout the app
- [@iconify/svelte]() makes icons easily accessible
- [@iconify/icons-fluent](https://www.npmjs.com/package/@iconify-icons/fluent) is the icon-pack used
- [highlight.js](https://www.npmjs.com/package/highlight.js) adds highlighting to code-blocks
- [showdown](https://www.npmjs.com/package/showdown) converts markdown into HTML
