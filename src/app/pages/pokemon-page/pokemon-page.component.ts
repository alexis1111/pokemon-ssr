import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';

import { SinglePokemon } from '../../pokemons/interfaces';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemon-page',
  imports: [],
  templateUrl: './pokemon-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonPageComponent implements OnInit {
  private pokemonService = inject(PokemonsService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
  pokemon = signal<SinglePokemon | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.pokemonService.loadPokemon(id)
    .pipe(tap(({ id, name }) => {
      const pageTitle = `#${id} - ${name}`;
      const pageDescription = `pagina del pokemon ${name}`;

      this.title.setTitle(pageTitle);
      this.meta.updateTag({ name: 'description', content: pageDescription });
      this.meta.updateTag({ name: 'og:title', content: pageTitle });
      this.meta.updateTag({ name: 'og:description', content: pageDescription });
      this.meta.updateTag({ name: 'og:image', content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` });

    }))
    .subscribe((pokemon) => {
      this.pokemon.set(pokemon);
    });
  }
}
