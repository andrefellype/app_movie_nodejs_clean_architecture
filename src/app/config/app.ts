import express from 'express'
import cors from 'cors'
import expressSession from 'express-session'

import routes from '../routes'
import path from 'path'

class App {
    public express: express.Application

    constructor() {
        this.express = express()
        this.middlewares()
        this.routes()
    }

    private middlewares(): void {
        this.express.use(express.json())
        this.express.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
            next()
        })
        this.express.use(cors())
        this.express.use(expressSession({ secret: 'hakunamatata', resave: false, saveUninitialized: false }))
        this.express.use('/files', express.static(path.resolve(__dirname, "..", "..", "..", "public", "upload")))
    }

    private routes(): void {
        this.express.use(routes)
    }

}

export default new App().express