import { Service } from 'typedi';
import { JsonController, Post, Get, Put, Delete, Body, Param, QueryParams, Res  } from 'routing-controllers';
import { LoginAuthDto, RefreshAuthDto } from '@/dto';
import { AuthService } from '@/services';
import { REFRESH_EXPIRE, TOKEN_EXPIRE } from '@/config';


@JsonController('/auth')
@Service()
export class AuthController {

    constructor( private authService: AuthService ){}

    @Post('/login')
    async login(@Body() loginDTO: LoginAuthDto) {

        const { email, password } = loginDTO;

        const { user, token, refreshToken } = await this.authService.login( email, password );
        
        return { 
            success: true, 
            user,
            token,
            refresh_token: refreshToken,
            token_expire: TOKEN_EXPIRE,
            refresh_expire: REFRESH_EXPIRE
        };

    }

    @Post('/refresh_token')
    async refresh(@Body() refreshDTO: RefreshAuthDto) {

        const { token } = refreshDTO;
        const { user, token: newToken } = await this.authService.refresh(token);

        return {
            success: true,
            user,
            token: newToken,
            token_expire: TOKEN_EXPIRE,
        };

    }
}