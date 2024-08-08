import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { LoginUserDto } from 'src/dto/user/login-user.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { prisma } from 'prisma';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService
    ) { }

    async signup(req: Request, res: Response, createUserDto: CreateUserDto) {

        const { userName, email, password } = createUserDto

        if (!userName || userName.trim() === "") {
            throw new BadRequestException('userName is required')
        }

        if (!email || email.trim() === "") {
            throw new BadRequestException('email is required')
        }

        if (!password || password.trim() === "") {
            throw new BadRequestException('password is required')
        }

        const isUserExists = await prisma.user.findUnique({ where: { email: email } })

        if (isUserExists) {
            throw new BadRequestException('email already taken')
        }

        const passwordHash = await bcrypt.hash(password, 12)

        const resp = await prisma.user.create({
            data: { userName: userName, email: email, password: passwordHash }
        })

        const id = resp?.id

        const hart = await this.jwtService.signAsync({
            userName, email, id
        })

        res.cookie('hart', hart, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 86400000) // 24 hours expiry
        });

        return res.send({
            message: "signup successful",
        })

    }

    async login(req: Request, res: Response, loginUserDto: LoginUserDto) {

        const { email, password } = loginUserDto

        if (!email || email.trim() === "") {
            throw new BadRequestException('email is required')
        }

        if (!password || password.trim() === "") {
            throw new BadRequestException('password is required')
        }

        const user = await prisma.user.findUnique({ where: { email: email } })

        if (!user) {
            throw new BadRequestException('email or password incorrect')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new BadRequestException('email or password incorrect')
        }

        const hart = await this.jwtService.signAsync({
            userName: user.userName,
            email: user.email,
            id: user.id
        })

        res.cookie('hart', hart, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 86400000) // 24 hours expiry
        });

        return res.send({
            message: "login successful",
        })

    }

    async logout(req: Request, res: Response) {

        res.clearCookie("hart")

        return res.send({
            message: "logout successfull"
        })

    }

}