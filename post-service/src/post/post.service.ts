import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/PostInput.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createPost(
    input: CreatePostInputDto,
    user: CurrentUserType,
  ): Promise<Post> {
    return this.postRepository.save({ ...input, userID: user.ID });
  }

  async updatePost(
    ID: string,
    input: UpdatePostInputDto,
    user: CurrentUserType,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { ID } });
    if (!post) {
      throw new NotFoundException('post not found');
    }

    Object.assign(post, { ...input, userID: user.ID });
    return this.postRepository.save(post);
  }

  async deletePost(ID: string): Promise<boolean> {
    const result = await this.postRepository.delete(ID);

    return result.affected > 0;
  }

  async getPostByID(ID: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { ID } });
    if (!post) {
      throw new NotFoundException('post not found');
    }

    return post;
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }
}
