import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { PokemonsService } from "./pokemons.service";
import { Pokemon, PokemonAPIResponse } from "../interfaces";
import { catchError } from "rxjs";

const mockPokeapiResponse: PokemonAPIResponse = {
  count: 2,
  next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
  previous: null,
  results: [
    {
      name: 'Bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/'
    },
    {
      name: 'Pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/2/'
    }
  ]
};

const expectedPokemons: Pokemon[] = [
  {
    id: '1',
    name: 'Bulbasaur',
  },
  {
    id: '2',
    name: 'Pikachu',
  }
];

const expectedPokemon = {
  id: '1',
  name: 'Bulbasaur'
};

describe('PokemonsService', () => {
  let service: PokemonsService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PokemonsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the pokemons', async() => {
    service.loadPage(1).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemons);
    });

    const request = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
    
    expect(request.request.method).toBe('GET');

    request.flush(mockPokeapiResponse);
  });

  it('should load page 5', async() => {
    service.loadPage(5).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemons);
    });

    const request = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=20&offset=80');
    
    expect(request.request.method).toBe('GET');

    request.flush(mockPokeapiResponse);
  });

  it('should load a pokemon by ID', () => {
    service.loadPokemon('1').subscribe((pokemon) => {
      expect(pokemon).toEqual(expectedPokemon as any);
    });

    const request = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1');
    
    expect(request.request.method).toBe('GET');

    request.flush(expectedPokemon);
  });

  it('should load a pokemon by NAME', () => {
    service.loadPokemon('bulbasaur').subscribe((pokemon) => {
      expect(pokemon).toEqual(expectedPokemon as any);
    });

    const request = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    
    expect(request.request.method).toBe('GET');

    request.flush(expectedPokemon);
  });

  it('should catch error if pokemon not found', () => {
    const pokemonName = 'not-found';

    service.loadPokemon(pokemonName).pipe(catchError(error => {
      expect(error.message).toContain('Pokemon not found');
      return [];
    })).subscribe();

    const request = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    expect(request.request.method).toBe('GET');

    request.flush('Pokemon not found', { status: 404, statusText: 'Not Found' });
  });
});