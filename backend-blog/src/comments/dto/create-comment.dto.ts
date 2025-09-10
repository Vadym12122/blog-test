import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  postId: number;
}
