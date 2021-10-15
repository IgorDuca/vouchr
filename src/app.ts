import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import routes from './routes'

import mongo from './config/mongoose.json'

class App {
    public express: express.Application

    public constructor () {
      this.express = express()
      this.middlewares()
      this.database()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private database (): void {
      mongoose.connect(mongo.mongo_uri)
    }

    private routes (): void {
      this.express.use(routes)
    }
}

export default new App().express