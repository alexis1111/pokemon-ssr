import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { PokemonListComponent } from "./pokemon-list.component";
import { Pokemon } from "../../interfaces";

const mockPokemons: Pokemon[] = [
  {
    id: '1',
    name: 'Bulbasaur',
  },
  {
    id: '2',
    name: 'Pikachu',
  }
]

describe('PokemonListComponent', () => {
  let fixture: ComponentFixture<PokemonListComponent>;
  let compiled: HTMLElement;
  let component: PokemonListComponent;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [PokemonListComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('pokemons', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render the list', () => {
    fixture.componentRef.setInput('pokemons', mockPokemons);
    fixture.detectChanges();

    expect(compiled.querySelectorAll('pokemon-card').length).toBe(2);
  });

  it('should render the no results', () => {
    fixture.componentRef.setInput('pokemons', []);
    fixture.detectChanges();

    expect(compiled.textContent).toBe('No pokemons');
  });
});