import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Query,
  Res,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import UserDto from './user.dto';
import {
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private users: UserDto[] = [];

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UserDto })
  create(@Body() user: UserDto) {
    // Create sample user with uuid as id
    this.users.push({
      id: uuidv4(),
      username: user.username,
      password: user.password,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  findAll(): UserDto[] {
    return this.users;
  }

  @Get('/vulnerable-sql/:username')
  @ApiOperation({ summary: 'Find a user by username' })
  @ApiParam({ name: 'username', description: 'Username to search for' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  findByUsername(@Param('username') username: string) {
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    console.log('SQL Query:', query);

    const user = this.users.find((u) => u.username === username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // 1. Vulnerabilidad de CORS
  @Get('/vulnerable-cors')
  @ApiOperation({ summary: 'Endpoint vulnerable a CORS' })
  @ApiHeader({
    name: 'Access-Control-Allow-Origin',
    description: 'Allow all origins',
  })
  @ApiResponse({ status: 200, description: 'CORS vulnerability exposed' })
  vulnerableCors(@Res() res: Response) {
    res.json({ message: 'CORS vulnerability exposed' });
  }

  // 2. Exponer información sensible
  @Get('/expose-sensitive-info')
  @ApiOperation({ summary: 'Exposes sensitive information' })
  @ApiResponse({
    status: 200,
    description: 'Sensitive information exposed',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
  })
  exposeSensitiveInfo() {
    return this.users.map((user) => ({
      username: user.username,
      password: user.password, // Exponiendo contraseñas en texto plano
    }));
  }

  // 3. Vulnerabilidad de Inyección de Comandos
  @Get('/command-injection')
  @ApiOperation({ summary: 'Vulnerable to command injection' })
  @ApiQuery({ name: 'cmd', description: 'Command to execute' })
  @ApiResponse({ status: 200, description: 'Command executed' })
  commandInjection(@Query('cmd') cmd: string) {
    const exec = require('child_process').exec;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
    });
    return { message: 'Command executed' };
  }

  // 4. Redirección abierta (Open Redirect)
  @Get('/open-redirect')
  @ApiOperation({ summary: 'Vulnerable to open redirect' })
  @ApiQuery({ name: 'url', description: 'URL to redirect to' })
  @ApiResponse({ status: 302, description: 'Redirection occurred' })
  openRedirect(@Query('url') url: string, @Res() res: Response) {
    res.redirect(url); // Redirige a cualquier URL proporcionada
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  findOne(@Param('id') id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return { message: 'User not found' };
    return user;
  }
}
