import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Pokemon, PokemonAPIResponse, SinglePokemon } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  private http = inject(HttpClient);

  loadPage(page: number): Observable<Pokemon[]> {
    if (page !== 0) {
      --page;
    }

    page = Math.max(0, page);

    return this.http
      .get<PokemonAPIResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page * 20}`
      )
      .pipe(
        map(({ results }) => {
          const simplePokemons: Pokemon[] = results.map(({ url, name }) => ({
            id: url.split('/').at(-2) ?? '',
            name,
          }));

          return simplePokemons;
        }),
      );
  }

  loadPokemon(id: string) {
    return this.http.get<SinglePokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }
}
