import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async getHello(): Promise<any> {
    const allUsers = await this.usersRepo.find();
    console.log('[SUPABASE USERS]', allUsers);
    return allUsers;
  }
}

