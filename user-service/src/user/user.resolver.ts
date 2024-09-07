import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { CreateInputUserDto, UpdateInputUserDto } from './dto/UserInput.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async user(@Args('ID') ID: string): Promise<User> {
    return this.userService.findOne(ID);
  }

  @Mutation(() => User)
  @Roles('admin')
  async createUser(
    @Args('createUserDto') createUserDto: CreateInputUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async updateUser(
    @Args('ID') ID: string,
    @Args('updateUserDto') updateUserDto: UpdateInputUserDto,
  ): Promise<User> {
    return this.userService.update(ID, updateUserDto);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Args('ID') ID: string): Promise<boolean> {
    return this.userService.delete(ID);
  }

  @Query(() => User)
  async getUserByUsername(@Args('username') username: string) {
    return this.userService.findOneByUsername(username);
  }
}
