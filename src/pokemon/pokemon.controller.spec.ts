import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonService } from './pokemon.service';

export class MockPokemonService {
  async createPokemon(): Promise<Pokemon> {
    return {
      id: 1,
      name: 'pikachu',
      type: 'electric',
      height: 4,
      pokeApiId: 25,
    };
  }
}
describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: MockPokemonService,
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new Pokemon when it does not already exist', async () => {
      const mockPokemonService = {
        createPokemon: jest.fn().mockResolvedValue({
          id: 1,
          name: 'pikachu',
          type: 'electric',
          height: 4,
          pokeApiId: 25,
        }),
      };
      const pokemonController = new PokemonController(
        mockPokemonService as any,
      );
      const result = await pokemonController.create('pikachu');
      expect(mockPokemonService.createPokemon).toHaveBeenCalledWith('pikachu');
      expect(result).toEqual({
        id: 1,
        name: 'pikachu',
        type: 'electric',
        height: 4,
        pokeApiId: 25,
      });
    });

    it('should throw an error when trying to create a Pokemon that already exists', async () => {
      const mockPokemonService = {
        createPokemon: jest
          .fn()
          .mockRejectedValue(new Error('pokemon ya existe')),
      };
      const pokemonController = new PokemonController(
        mockPokemonService as any,
      );
      await expect(pokemonController.create('pikachu')).rejects.toThrow(
        'pokemon ya existe',
      );
      expect(mockPokemonService.createPokemon).toHaveBeenCalledWith('pikachu');
    });
  });

  describe('findPokemon', () => {
    it('should return a Pokemon object when the name exists in the database', async () => {
      const mockPokemonService = {
        findPokemon: jest.fn().mockResolvedValue({
          id: 1,
          name: 'pikachu',
          type: 'electric',
          height: 4,
          pokeApiId: 25,
        }),
      };
      const pokemonController = new PokemonController(
        mockPokemonService as any,
      );
      const result = await pokemonController.findPokemon('pikachu');
      expect(mockPokemonService.findPokemon).toHaveBeenCalledWith('pikachu');
      expect(result).toEqual({
        id: 1,
        name: 'pikachu',
        type: 'electric',
        height: 4,
        pokeApiId: 25,
      });
    });
    it('should throw an error when the Pokemon name does not exist in the database', async () => {
      const mockPokemonService = {
        findPokemon: jest.fn().mockResolvedValue(undefined),
      };
      const pokemonController = new PokemonController(
        mockPokemonService as any,
      );
      const result = await pokemonController.findPokemon('pikachunoexiste');
      expect(mockPokemonService.findPokemon).toHaveBeenCalledWith(
        'pikachunoexiste',
      );
      expect(result).toEqual(undefined);
    });
  });
});
