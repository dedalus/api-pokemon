import { Param, Get, Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './entities/pokemon.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post(':name')
  async create(@Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.createPokemon(name);
  }

  @Get(':name')
  async findPokemon(@Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.findPokemon(name);
  }

   
}
