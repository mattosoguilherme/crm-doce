import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Role } from 'src/utils/roles.enum';
import { AuthService } from './auth.service';
import { LoggedUser } from './decorators/logged.decorator';
import { Roles } from './decorators/roles.decorator';
import { LoginInputDto } from './dto/loginInput.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { RolesGuard } from './guards/roles.guard';
import { CrmService } from 'src/crm.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private crm: CrmService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Fazer Login.' })
  login(@Body() loginDto: LoginInputDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get()
  @ApiOperation({ summary: 'User logado com sucesso!' })
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  me(@LoggedUser() user: User) {
    return this.crm.findUserById(user.id);
  }
}
