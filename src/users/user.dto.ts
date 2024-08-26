import { ApiProperty } from '@nestjs/swagger';

export default class UserDto {
  id: string;
  @ApiProperty({ description: 'The username of the User' })
  username: string;
  @ApiProperty({ description: 'The password of the User' })
  password: string;
}
