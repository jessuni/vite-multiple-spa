import { Connect, Plugin, ViteDevServer, send } from 'vite'
import { readFileSync, existsSync } from 'fs'

export interface Options {
  input: { [key: string]: string },
}

export interface IncomingMessage extends Connect.IncomingMessage {
  url?: string
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



    const file = Object.keys(options.input).filter(k => {
      const pattern = new RegExp('^' + k)
      return pattern.test(url)
    })
    const filePath = options.input[file[0]]
    if (!existsSync(filePath)) {
      console.error(new Error(`Cannot find ${filePath}.`))
      return next()
    }
    let html = readFileSync(filePath, 'utf-8')
    try {
      html = await server.transformIndexHtml(url, html)
      return send(req, res, html, 'html')
    } catch (err) {
      console.error(err)
      return next(err)
    }
  }
}

export default function multiSpa(options: Options):Plugin {
  return {
    name: 'multiSpa',
    configureServer(server: ViteDevServer):void {
      server.middlewares.use(transformHtml(options, server))
    }
  }
}
