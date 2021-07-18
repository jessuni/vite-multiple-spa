This is a WIP project that is not yet released on npm simply because... I haven't finished writing tests😝

# vite-multi-spa

This plugin is suitable for projects that due to some reasons, have two or more SPA apps inside the same package, using the same vite server. Since Vite does not support this situation out of the box, this plugin works by choosing the right entry html file to serve depending on the current route path.

## Installation
`npm i --save-dev vite-plugin-multi-spa`

## Usage

Given a project structure such as the following:

```
|--admin
|----index.html
|----router.js
|--dashboard
|----index.html
|----router.js
|--package.json
|--vite.config.js
```

...and the route paths in `admin` all starts with `/admin` while the route paths in `dashboard` all starts with `/dashboard`.

Configure vite to serve different html files in `vite.config.js`

```javascript
import multiSpa from 'vite-plugin-multi-spa'

defineConfig({
  plugins: [
    multiSpa({
      input: {
        '/admin': '/admin/index.html',
        '/dashboard': '/dashboard/index.html'
      },
    }),
  ],
})
```

...where the keys of `input` should be the a path prefix that could determine which html file to serve.


