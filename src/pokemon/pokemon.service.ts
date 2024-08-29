import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import axios from 'axios';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async createPokemon(name: string): Promise<Pokemon> {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`,
      );
      const data = response.data;

      const newPokemon = this.pokemonRepository.create({
        name: data.name,
        type: data.types[0].type.name,
        height: data.height,
        pokeApiId: data.id,
      });

      const existPokemon = await this.findPokemon(newPokemon.name);

      if (!existPokemon) return await this.pokemonRepository.save(newPokemon);
      else throw { message: 'pokemon ya existe' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findPokemon(name: string): Promise<Pokemon> {
    try {
      return await this.pokemonRepository.findOneBy({
        name: name,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'pokemon no encontrado',
      });
    }
  }
}
