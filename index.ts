import { Connect, Plugin, ViteDevServer, send } from 'vite'
import { readFileSync, existsSync } from 'fs'

export interface Options {
  // the content to be replaced
  search?: string | RegExp,
  docFile?: string,
  // target string
  input: { [key: string]: string },
}

export interface IncomingMessage extends Connect.IncomingMessage {
  url?: string
}

const OPTIONS: Options = {
  search: 'ROOT_APP',
  docFile: './index.html',
  input: { index: 'index' },
}

function transformHtml(
  options: Options,
  server: ViteDevServer
  ): Connect.NextHandleFunction {
  return async function middleware(req: IncomingMessage, res, next) {
    const url = req.url
    if (req.headers['sec-fetch-dest'] !== 'document') {
      return next()
    }

    let _title
    if (/^\/account/.test(url)) {
      _title = 'Account'
    } else if (/^\/admin/.test(url)) {
      _title = 'Admin'
    }
    if (_title) {
      let html:string = readFileSync(options.docFile, 'utf-8')
      try {
        html = html.replace('APP_ROOT', _title.toLowerCase())
          .replace('APP_TITLE', _title)
        html = await server.transformIndexHtml(url, html)
        return send(req, res, html, 'html')
      } catch (err) {
        console.error(err)
        return next(err)
      }
    }
    next()
  }
}

export default function multiSpa(options: Options):Plugin {
  const _options = { ...OPTIONS, ...options }
  if (!existsSync(_options.docFile)) {
    throw new Error('docFile does not exist.')
  }
  return {
    name: 'multiSpa',
    configureServer(server: ViteDevServer):void {
      server.middlewares.use(transformHtml(_options, server))
    }
  }
}
