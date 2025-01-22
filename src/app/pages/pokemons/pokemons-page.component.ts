import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';

import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { Pokemon } from '../../pokemons/interfaces';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemons-page',
  imports: [PokemonListComponent, PokemonListSkeletonComponent],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit, OnDestroy {
  private pokemonsService = inject(PokemonsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appRef = inject(ApplicationRef);
  private $appState = this.appRef.isStable.subscribe((isStable) => {
    console.log(isStable);
  });
  private title = inject(Title);

  isLoading = signal(false);
  pokemons = signal<Pokemon[]>([]);
  currentPage = toSignal<number>(
    this.route.queryParamMap.pipe(
      map((params) => params.get('page') ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);
    this.loadPokemons();
  }

  loadPokemons(page = 0): void {
    const pageToLoad = this.currentPage()! + page;

    this.pokemonsService.loadPage(pageToLoad).pipe(
      tap(() => {
        this.router.navigate([], {
          queryParams: { page: pageToLoad },
        });
      }),
      tap(() => this.title.setTitle(`Pokemons - Page ${pageToLoad}`))
    ).subscribe((pokemons) => {
      this.pokemons.set(pokemons);
    });
  }

  ngOnDestroy(): void {
    this.$appState.unsubscribe();
  }
}
