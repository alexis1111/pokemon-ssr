import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { Location } from "@angular/common";

import { routes } from "./app.routes";

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)]
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to About', async() => {
    await router.navigate(['about']);

    expect(location.path()).toBe('/about');
  });

  it('should navigate to Pokemons page 1', async() => {
    await router.navigate(['pokemons/page/1']);

    expect(location.path()).toBe('/pokemons/page/1');
  });

  it('should redirect to about when route is not recognized', async() => {
    await router.navigate(['test']);

    expect(location.path()).toBe('/about');
  });

  it('should load the proper component', async() => {
    const aboutRoute = routes.find((route) => route.path === 'about')!;
    expect(aboutRoute).toBeDefined();

    const aboutComponent = await aboutRoute.loadComponent!() as any;
    expect(aboutComponent.default.name).toBe('AboutPageComponent');

    const pokemonPageRoute = routes.find((route) => route.path === 'pokemons/page/:page')!;
    expect(pokemonPageRoute).toBeDefined();

    const pokemonComponent = await pokemonPageRoute.loadComponent!() as any;
    expect(pokemonComponent.default.name).toBe('PokemonsPageComponent');
  });
});