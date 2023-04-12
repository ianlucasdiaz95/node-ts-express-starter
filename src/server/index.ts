import express from 'express';
import 'reflect-metadata'; // this shim is required
import { RoutingControllersOptions, createExpressServer, getMetadataArgsStorage, useContainer } from 'routing-controllers';
import { MorganMiddleware, ErrorMiddleware, RateMiddleware } from '@/middlewares';
import { PORT } from '@/config'
import { UserController, RoleController } from '@/controllers';
import { Container } from 'typedi';
import { dataSource } from '@/db/connection';
import { swaggerSpec } from '@/swagger';

// required by routing-controllers
useContainer(Container);

export class Server {
    app: express.Express
    port: string
    routingControllersOptions: any

    constructor(){
        this.port = PORT
        this.routingControllersOptions = {
            controllers: [
                UserController,
                RoleController
            ],
            routePrefix: '/api',
            cors: {
                origin: '*',
            },
            middlewares: [
                MorganMiddleware,
                ErrorMiddleware,
                RateMiddleware
            ],
            defaultErrorHandler: false,
        }

    }

    async init(){

        this.app = createExpressServer(this.routingControllersOptions)

        //Database connection
        await this.dbConnection()

        //Mount app
        await this.listen();

        //Init docs
        this.initDocs();
    }

    async dbConnection(){
        try {
            await dataSource.initialize()

            console.log('Database is up');
        } catch (error) {
            console.log('Database error: ', error);
        }
        
    }

    initDocs(){
        try {
            swaggerSpec(getMetadataArgsStorage, this.routingControllersOptions, this.app);

            console.log('OpenAPI docs running on /docs');
        } catch (error) {
            console.log(error);
        }
        
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server running on port: ' + this.port);
        })
    }
}