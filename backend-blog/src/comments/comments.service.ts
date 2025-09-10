import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postsRepository.findOne({
      where: { id: createCommentDto.postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentsRepository.create({
      author: createCommentDto.author,
      text: createCommentDto.text,
      post,
    });
    return this.commentsRepository.save(comment);
  }

  async findAll(postId?: number): Promise<Comment[]> {
    const options: any = { relations: ['post'] };
    if (postId) options.where = { post: { id: postId } };
    return this.commentsRepository.find(options);
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['post'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (updateCommentDto.postId) {
      const post = await this.postsRepository.findOne({
        where: { id: updateCommentDto.postId },
      });
      if (!post) throw new NotFoundException('Post not found');
      comment.post = post;
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentsRepository.remove(comment);
  }
}
