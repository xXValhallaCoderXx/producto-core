import {
  Controller,
  Request,
  UseGuards,
  Body,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/local.auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RefreshTokenAuthGuard } from 'src/guards/jwt-refresh.auth.guard';
import {
  AuthUserDTO,
  VerifyEmailParams,
  OtpRequestDTO,
  OtpVerifyDTO,
  ForgotPasswordUpdate,
} from './auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // This will only be invoked if it passes Local Strategy
    // Req will have a user param injected in
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req) {
    // This will only be invoked if it passes Local Strategy
    // Req will have a user param injected in
    return this.authService.logout(req.user);
  }

  @Post('register')
  async register(@Body() registerUserDto: AuthUserDTO) {
    return this.authService.registerAccount(registerUserDto);
  }

  @Post('otp-request')
  async otpRequest(@Body() otpRequestData: OtpRequestDTO) {
    return this.authService.otpRequest(otpRequestData);
  }

  @Post('otp-verify')
  async otpVerify(@Body() otpVerifyData: OtpVerifyDTO) {
    return this.authService.otpVerify(otpVerifyData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('forgot-password-update')
  async forgotPasswordUpdate(
    @Request() req,
    @Body() otpVerifyData: ForgotPasswordUpdate,
  ) {
    return this.authService.otpUpdatePassword(req.user, otpVerifyData);
  }

  @Get('verify-email')
  async verifyEmail(@Query() query: VerifyEmailParams) {
    return this.authService.verifyEmail(query.email);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('refresh-jwt')
  async refreshJwt(@Request() req) {
    return this.authService.refreshJwt(req.user);
  }
}
