import { Body, Controller, Delete, Get, HttpCode, Patch, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: "Informazioni utente loggato"
    })
    @ApiOkResponse({
        description: "Profilo utente",
        schema: {
            example: {
                email: "mario.rossi@prova.it",
                name: "MarioRossi",
                createdAt: "2025-09.10",
                updayeAt: "2025-09.10",
            }
        }
    })
    @Get('me')
    getProfile(@Request() req: Request){
        return this.usersService.getProfile(req)
    }

    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: "Modificare informazioni utente loggato"
    })
    @ApiBody({type: UpdateUserDto})
    @ApiOkResponse({
        description: "Profilo utente aggiornato",
        schema: {
            example: {
                email: "mario.rossi@prova.it",
                name: "MarioRossi",
                createdAt: "2025-09.10",
                updayeAt: "2025-09.10",
            }
        }
    })
    @Patch('me')
    updateProfile(@Request() req: Request, @Body(ValidationPipe) updateUserDto: UpdateUserDto){
        return this.usersService.updateProfile(req, updateUserDto)
    }

    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: "Eliminare profilo utente loggato"
    })
    @ApiNoContentResponse({
        description: "Profilo utente eliminato con successo"})
    @Delete('me')
    @HttpCode(204)
    deleteProfile(@Request() req: Request){
        return this.usersService.deleteProfile(req)
    }

}
