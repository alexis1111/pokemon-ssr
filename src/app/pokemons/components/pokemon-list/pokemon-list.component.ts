import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { Pokemon } from '../../interfaces';

@Component({
  selector: 'pokemon-list',
  imports: [PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent {
  pokemons = input.required<Pokemon[]>();
}
