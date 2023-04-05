import express from 'express';
import 'reflect-metadata'; // this shim is required
import { createExpressServer, useContainer } from 'routing-controllers';
import { MorganMiddleware, ErrorMiddleware } from '../middlewares';
import { PORT } from '../config'
import { UserController } from '../controllers';
import { Container } from 'typedi';
import { dataSource } from '../db/connection';
import { pagination } from 'typeorm-pagination';

// required by routing-controllers
useContainer(Container);

export class Server {
    app: express.Express
    port: string

    constructor(){
        this.port = PORT
        this.app = createExpressServer({
            controllers: [UserController],
            routePrefix: '/api',
            cors: {
                origin: '*',
            },
            middlewares: [
                MorganMiddleware,
                ErrorMiddleware,
                pagination
            ],
            defaultErrorHandler: false,
        })

    }

    async init(){

        //Database connection
        await this.dbConnection()

        //Mount app
        await this.listen();
    }

    async dbConnection(){
        try {
            await dataSource.initialize()

            console.log('Database is up.');
        } catch (error) {
            console.log('Database error: ', error);
        }
        
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server running on port: ' + this.port);
        })
    }
}