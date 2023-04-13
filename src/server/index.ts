import express from 'express';
import 'reflect-metadata'; // this shim is required
import { RoutingControllersOptions, createExpressServer, getMetadataArgsStorage, useContainer } from 'routing-controllers';
import { MorganMiddleware, ErrorMiddleware, RateMiddleware } from '@/middlewares';
import { PORT } from '@/config'
import { UserController, RoleController, AuthController } from '@/controllers';
import { Container } from 'typedi';
import { dataSource } from '@/db/connection';
import { swaggerSpec } from '@/swagger';
import path from 'path';
import { CheckerService } from '@/services';

// required by routing-controllers
useContainer(Container);

export class Server {
    app: express.Express
    port: string
    routingControllersOptions: RoutingControllersOptions

    constructor(){
        this.port = PORT
        this.routingControllersOptions = {
            controllers: [
                UserController,
                RoleController,
                AuthController
            ],
            routePrefix: '/api',
            currentUserChecker: CheckerService.getInstance().currentUserChecker,
            authorizationChecker: CheckerService.getInstance().authorizationChecker,
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

        //404 Redirect
        this.app.use((req, res) => {
            if (req.accepts('html') && !res.headersSent) {
                res.sendFile(path.join(__dirname, '../public', '404.html'));
            }
        })

        //Mount app
        await this.listen();

        //Init docs
        this.docs();
    }

    async dbConnection(){
        try {
            await dataSource.initialize()

            console.log('Database is up');
        } catch (error) {
            console.log('Database error: ', error);
        }
        
    }

    docs(){
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