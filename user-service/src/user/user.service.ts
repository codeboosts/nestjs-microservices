import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateInputUserDto, UpdateInputUserDto } from './dto/UserInput.dto';
import { onComparePassword } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(input: CreateInputUserDto): Promise<User> {
    const { username, email } = input;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const user = this.userRepository.create(input);

    await this.userRepository.save(user);
    return user;
  }

  async findOne(ID: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ ID });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(ID: string, input: UpdateInputUserDto): Promise<User> {
    const user = await this.findOne(ID);

    if (input.username) {
      const existingUser = await this.findOneByUsername(input.username);
      if (existingUser && existingUser.ID !== user.ID) {
        throw new ConflictException('username already exists');
      }

      user.username = input.username;
    }

    if (input.email) {
      const existingUser = await this.findByEmail(input.email);
      if (existingUser && existingUser.ID !== user.ID) {
        throw new ConflictException('email already exists');
      }

      user.email = input.email;
    }

    return this.userRepository.save(user);
  }

  async delete(ID: string): Promise<boolean> {
    const result = await this.userRepository.delete(ID);
    return result.affected > 0;
  }

  async validateUserPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findOneByUsername(username);

    const isPasswordValid = onComparePassword(user.password, password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
