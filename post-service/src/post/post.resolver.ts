import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/PostInput.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  @UseGuards(AuthGuard)
  async getAllPosts(): Promise<Post[]> {
    return this.postService.getAllPosts();
  }

  @Query(() => Post)
  @UseGuards(AuthGuard)
  async getPostByID(@Args('ID') ID: string): Promise<Post> {
    return this.postService.getPostByID(ID);
  }

  @Mutation(() => Post)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('user', 'admin')
  async createPost(
    @Args('input') input: CreatePostInputDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Post> {
    return this.postService.createPost(input, user);
  }

  @Mutation(() => Post)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('user', 'admin')
  async updatePost(
    @Args('ID') ID: string,
    @Args('input') input: UpdatePostInputDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Post> {
    return this.postService.updatePost(ID, input, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async deletePost(@Args('ID') ID: string): Promise<boolean> {
    return this.postService.deletePost(ID);
  }
}
