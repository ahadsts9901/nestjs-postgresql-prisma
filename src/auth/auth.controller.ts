import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { LoginUserDto } from 'src/dto/user/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signup(@Req() req, @Res() res, @Body() createUserDto: CreateUserDto) {
        return this.authService.signup(req, res, createUserDto)
    }

    @Post('login')
    login(@Req() req, @Res() res, @Body() loginUserDto: LoginUserDto) {
        return this.authService.login(req, res, loginUserDto)
    }

    @Post('logout')
    logout(@Req() req, @Res() res) {
        return this.authService.logout(req, res)
    }

}