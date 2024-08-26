import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import UserDto from './user.dto';


@Controller('users')
export class UsersController {
    private users = [];

    @Post()
    create(@Body() user: UserDto) {
        console.log('Creating user endpoint:', user);
        // Create sample user with uuid as id
        this.users.push({
            id: uuidv4(),
            username: user.username,
            password: user.password
        });
    }

    @Get()
    findAll() {
        return this.users;
    }

    @Get('/vulnerable-sql/:username')
    findByUsername(@Param('username') username: string) {
        const query = `SELECT * FROM users WHERE username = '${username}'`;
        console.log('SQL Query:', query);

        const user = this.users.find((u) => u.username === username);
        if (!user) return { message: 'User not found' };
        return user;
    }

    @Get('/expose-sensitive-info')
    exposeSensitiveInfo() {
        return this.users.map((user) => ({
            username: user.username,
            password: user.password, // Exponiendo contraseñas en texto plano
        }));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const user = this.users.find((u) => u.id === id);
        if (!user) return { message: 'User not found' };
        return user;
    }
}
