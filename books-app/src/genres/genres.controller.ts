import { Body, Controller,  UseGuards,  Get, Post, Response, Param } from '@nestjs/common';
import { CreateGenreDto } from './dto/create_genre.dto';
import { UpdateGenreDto } from './dto/update_genre.dto';
import { GenresService } from './genres.service';
import { AuthGuard } from '../shared/auth.gaurd';

@Controller('api/v1')
export class GenresController {
    constructor(
        private genreService: GenresService) {
    }

    @Get('genres')
    @UseGuards(new AuthGuard())
    async getGenresList(@Response() res) {
        const genre = await this.genreService.getAllGenre(res);
    }

    @Post('genre') 
    @UseGuards(new AuthGuard())
    async create(@Response() res,@Body() createGenreDto: CreateGenreDto) {
        return this.genreService.addGenre(res,createGenreDto);
    }

    @Post('genre_status/:group_id/:status')
    @UseGuards(new AuthGuard())
    async updateStatus(@Response() res,@Param() updateGenreDto: UpdateGenreDto) {
        await this.genreService.updateStatus(res,updateGenreDto);
    }
}