import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>
  ) {}

  async findAll() {
    return this.usersRepo.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

    async create(userData: Partial<User>) {
        if (!userData.password) throw new ConflictException('Senha é obrigatória');
        if (!userData.email) throw new ConflictException('Email é obrigatório');
        const existing = await this.findByEmail(userData.email);
        if (existing) throw new ConflictException('Email já cadastrado');
        const password = await bcrypt.hash(userData.password, 10);
        const user = this.usersRepo.create({ ...userData, password });
        return this.usersRepo.save(user);
    }

  async update(id: string, updates: Partial<User>) {
    const hasUpdateValues =
      updates &&
      Object.keys(updates).some((key) => updates[key as keyof User] !== undefined && updates[key as keyof User] !== '');

    if (!hasUpdateValues) {
      return this.findById(id);
    }

    if (updates.password !== undefined) {
      if (!updates.password) throw new ConflictException('Senha não pode ser vazia');
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await this.usersRepo.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.usersRepo.delete(id);
  }
}
