import { TOKEN_SECRET } from "@/config";
import { dataSource } from "@/db/connection";
import { User } from "@/entities";
import { JwtPayload, verify } from "jsonwebtoken";
import { Action } from "routing-controllers";
import { Service } from "typedi"

@Service()
export class CheckerService {

    private static instance: CheckerService;

    public static getInstance(): CheckerService {
        if (!this.instance) {
            this.instance = new CheckerService();
        }

        return this.instance;
    }

    async currentUserChecker(action: Action){
        const { request: req } = action

        const accessToken = req.headers.authorization.split(' ')[1];

        if (!accessToken) {
            return false;
        }

        const accessTokenPayload = verify(
            accessToken,
            TOKEN_SECRET
        ) as JwtPayload;

        const userRepository = dataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { id: accessTokenPayload.id },
        });

        return user;
    }

    async authorizationChecker(action: Action, roles?: string | string[]) {
        try {
            const { request: req } = action
            const accessToken = req.headers.authorization.split(' ')[1];

            if (!accessToken) {
                return false;
            }

            const accessTokenPayload = verify(
                accessToken,
                TOKEN_SECRET
            ) as JwtPayload;

            const userRepository = dataSource.getRepository(User);

            const user = await userRepository.findOne({
                where: { id: accessTokenPayload.id },
            });

            if (!user) {
                return false;
            }

            if (roles.length != 0 && !roles.includes(user.role)) {
                return false;
            }

            return true;

        } catch (error) {

            return false;

        }
    }
}