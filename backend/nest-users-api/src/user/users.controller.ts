import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { defineAbilityFor } from '../casl/casl-ability.factory';

@Controller('users')
@UseGuards(JwtAuthGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Req() req) {
    const ability = defineAbilityFor(req.user);
    if (ability.cannot('read', 'User')) throw new ForbiddenException();
    return this.usersService.findAll();
  }

  // Ver um usuário por id
  @Get(':id')
    async findOne(@Req() req, @Param('id') id: string) {
      const ability = defineAbilityFor(req.user);
      if (req.user.role === 'user' && req.user.userId !== id) {
        throw new ForbiddenException('Você só pode acessar seu próprio perfil');
      }
      if (ability.cannot('read', 'User')) throw new ForbiddenException();
      return this.usersService.findById(id);
    }

  // Criar usuário (apenas admin)
  @Post()
  async create(@Req() req, @Body() body) {
    const ability = defineAbilityFor(req.user);
    if (ability.cannot('create', 'User')) throw new ForbiddenException();
    return this.usersService.create(body);
  }

  // Atualizar usuário
  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updates) {
    const ability = defineAbilityFor(req.user);

    // Usuário comum só pode editar o próprio perfil
    if (req.user.role === 'user' && req.user.userId !== id) {
      throw new ForbiddenException('Você só pode editar seu próprio perfil');
    }

    if (ability.cannot('update', 'User')) throw new ForbiddenException();
    return this.usersService.update(id, updates);
  }

  // Deletar usuário (apenas admin)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const ability = defineAbilityFor(req.user);
    if (ability.cannot('delete', 'User')) throw new ForbiddenException();
    return this.usersService.delete(id);
  }
}
