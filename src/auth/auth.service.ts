import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { SinginDto } from './dto/sigin.dto';
import { IUserRepository } from './interfaces/user-repository.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) { }

  public async signin(signinDto: SinginDto): Promise<AuthDto> {
    const user = await this.userRepository.createUser(signinDto);
    return { token: this.jwtService.sign({ email: user.email, id: user.id }) }
  }
  public async login(loginDto: LoginDto): Promise<AuthDto> {
    const { email, password } = loginDto;
    const userFound = await this.userRepository.findUserByEmail(email);
    if (!userFound) throw new UnauthorizedException('Invalid credentials');
    if (!await userFound.comparePassport(password)) throw new UnauthorizedException('Invalid creadentials');
    return { token: this.jwtService.sign({ email: userFound.email, id: userFound.id }) }
  }
}
