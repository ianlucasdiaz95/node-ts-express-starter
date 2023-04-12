import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';
import * as oa from "openapi3-ts";
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { name, description, version } from '@/../package.json';
const { defaultMetadataStorage } = require('class-transformer/cjs/storage')

export const swaggerSpec = ( getMetadataArgsStorage, routingControllersOptions, app) => {
    // Parse class-validator classes into JSON Schema:
    const schemas = validationMetadatasToSchemas({
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: '#/components/schemas/',
    })

    // Parse routing-controllers classes into OpenAPI spec:
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
        components: {
            schemas: schemas as Record<string, oa.SchemaObject | oa.ReferenceObject >,
            securitySchemes: {
                basicAuth: {
                    scheme: 'basic',
                    type: 'http',
                },
            },
        },
        info: {
            description: description,
            title: name,
            version: version,
        },
    })

    app.use('/docs',
        swaggerUiExpress.serve,
        swaggerUiExpress.setup(spec)
    );
};
