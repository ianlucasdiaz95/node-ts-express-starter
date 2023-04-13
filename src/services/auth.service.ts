import { UserService } from '@/services';
import { Service } from "typedi"
import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import jwt, { JwtPayload, verify } from 'jsonwebtoken';
import { TOKEN_SECRET, TOKEN_EXPIRE, REFRESH_EXPIRE, REFRESH_SECRET } from '@/config';
import { compare } from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { dataSource } from '@/db/connection';
import { User } from '@/entities';
import { IUser } from '@/interfaces/user.interface';

@Service()
export class AuthService {

    constructor(private userService: UserService) { }

    async login(email: string, password: string){

        const user = instanceToPlain(await this.userService.getUserByEmail(email)) 

        const isMatch = await compare(password, user.password)

        if(!isMatch){
            throw new UnauthorizedError('Authenthication failed.')
        }

        const token = this.generateToken(user);
        const refreshToken = this.generateRefresh(user);

        return {
            user,
            token,
            refreshToken
        }
    }

    async refresh(refreshToken: string) {

        try {

            if (!refreshToken) {
                throw new BadRequestError('Please provide a refresh token');
            }

            const refreshTokenPayload = verify(
                refreshToken,
                REFRESH_SECRET
            ) as JwtPayload;

            /**
             * TODO: CREATE A FUNCTION TO GET USER BY JWT TOKEN OR ID FROM SERVICE
             */

            const userRepository = dataSource.getRepository(User);

            const user = instanceToPlain(await userRepository.findOne({
                where: { id: refreshTokenPayload.id },
            })) as IUser;

            if (!user) {
                throw new UnauthorizedError('User is not active');
            }

            const token = this.generateToken(user);

            return {
                user,
                token,
            }
            
        } catch (error) {
            console.log(error);
            throw new BadRequestError('There was an error with the request');

        }

    }

    generateToken(payload: string | Object | Buffer){
        return jwt.sign(payload, TOKEN_SECRET, { expiresIn: Number(TOKEN_EXPIRE) } )
    }

    generateRefresh(payload: string | Object | Buffer) {
        return jwt.sign(payload, REFRESH_SECRET, { expiresIn: Number(REFRESH_EXPIRE) })
    }
}