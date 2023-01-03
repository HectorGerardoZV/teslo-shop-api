import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { SinginDto } from './dto/sigin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signin')
  public async signin(
    @Body() signinDto: SinginDto
  ): Promise<AuthDto> {
    return await this.authService.signin(signinDto);
  }
  @Post('login')
  public async login(
    @Body() loginDto: LoginDto
  ): Promise<AuthDto> {
    return await this.authService.login(loginDto);
  }
}
