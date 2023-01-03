import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../user.repository";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { ConfigService } from "@nestjs/config";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: IUserRepository,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    public async validate(jwtPayload: JwtPayload): Promise<User> {
        const { email } = jwtPayload;
        const userFound = await this.userRepository.findUserByEmail(email);
        if (!userFound) throw new UnauthorizedException('Invalid token');
        if (!userFound.isActive) throw new UnauthorizedException('User is inactive, takl with an admin');
        return userFound;
    }
}