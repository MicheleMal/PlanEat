import { Body, Controller, Delete, Get, HttpCode, Patch, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @UseGuards(AuthGuard)
    @Get('me')
    getProfile(@Request() req: Request){
        return this.usersService.getProfile(req)
    }

    @UseGuards(AuthGuard)
    @Patch('me')
    updateProfile(@Request() req: Request, @Body(ValidationPipe) updateUserDto: UpdateUserDto){
        return this.usersService.updateProfile(req, updateUserDto)
    }

    @UseGuards(AuthGuard)
    @Delete('me')
    @HttpCode(204)
    deleteProfile(@Request() req: Request){
        return this.usersService.deleteProfile(req)
    }

}
