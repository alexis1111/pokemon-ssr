import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PokemonCardComponent } from "./pokemon-card.component";
import { provideRouter } from "@angular/router";
import { Pokemon } from "../../interfaces";

const mockPokemon: Pokemon = {
  id: '1',
  name: 'Bulbasaur',
}

describe('PokemonCardComponent', () => {
  let fixture: ComponentFixture<PokemonCardComponent>;
  let compiled: HTMLElement;
  let component: PokemonCardComponent;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have pokemon signal value', () => {
    expect(component.pokemon()).toEqual(mockPokemon);
  });

  it('should render the pokemon name and image correctly', () => {
    const image = compiled.querySelector('img')!;
    
    expect(image).toBeDefined();
    expect(image.src).toEqual('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png');
    expect(compiled.textContent).toBe(mockPokemon.name);
  });

  it('should have the correct link', () => {
    const divWithLink = compiled.querySelector('div')!;
    const link = divWithLink.attributes.getNamedItem('ng-reflect-router-link')!.value;
    
    expect(link).toBe(`/pokemons,${mockPokemon.name}`);
  });
});