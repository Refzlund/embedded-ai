import preprocess from "svelte-preprocess"
import adapter from "@sveltejs/adapter-static"
import { awesomePugPre, awesomePugPost } from 'svelte-awesome-pug'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		awesomePugPre,
		preprocess({
			scss: {
				includePaths: ["node_modules/scss-color-var"],
				prependData: `
					@use 'scss-color-var/var.scss';
					@use 'scss-color-var/v.scss' as *;
					@use 'scss-color-var/util.scss' as *;
					@use 'src/lib/styles/mixins.scss' as m;
				`
			}
		}),
		awesomePugPost
	],
	kit: {
		adapter: adapter(),
		alias: {
			
		}
    }
}

export default config