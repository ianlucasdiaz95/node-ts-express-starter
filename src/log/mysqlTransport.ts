import Transport from "winston-transport";
import { Log } from "@/entities";
import { dataSource } from "@/db/connection";

const logRepository = dataSource.getRepository(Log)
//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
export class MysqlTransport extends Transport {
    constructor(opts) {
        super(opts);
        //
        // Consume any custom options here. e.g.:
        // - Connection information for databases
        // - Authentication information for APIs (e.g. loggly, papertrail, 
        //   logentries, etc.).
        //
    }

    async log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        try {

            await logRepository.save({
                message: info.message,
                level: info.level
            });

        } catch (error) {
            console.log(error);
        }

        // Perform the writing to the remote service
        callback();
    }
};