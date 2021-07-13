This is a WIP project that is not yet released on npm.

# vite-multi-spa

This plugin is suitable for projects that due to some reasons, have two SPA Vue app inside the same package, using the same vite server. Since Vite does not support this situation out of the box, this plugin works by altering the script `src` in your entry html file to your desired path on dev server request.

## Installation
`npm i --save-dev vite-multi-spa`

## Usage

```javascript
// in vite.config.js

defineConfig({
  plugin(multiSpa(options))
})
```

## Plugin options

```javascript
interface Options {
  search: 'ROOT_APP' // the target string or RegExp to be replaced
  docFile: './index.html' // html path
  input: { admin: 'admin' }
}
```

