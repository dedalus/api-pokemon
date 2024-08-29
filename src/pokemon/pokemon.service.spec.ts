import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PokemonService', () => {
  let service: PokemonService;
  let repository: Repository<Pokemon>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(Pokemon),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  xdescribe('create', () => {
    it('should create a new Pokemon when it does not already exist', async () => {
      const mockPokemonRepository = {
        create: jest.fn().mockReturnValue({}),
        save: jest.fn().mockResolvedValue({}),
      };
      const mockAxios = {
        get: jest.fn().mockResolvedValue({
          data: {
            name: 'pikachu',
            types: [{ type: { name: 'electric' } }],
            height: 4,
            id: 25,
          },
        }),
      };

      const result = await service.createPokemon('pikachu');

      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu',
      );
      expect(mockPokemonRepository.create).toHaveBeenCalledWith({
        name: 'pikachu',
        type: 'electric',
        height: 4,
        pokeApiId: 25,
      });
      expect(mockPokemonRepository.save).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
});
