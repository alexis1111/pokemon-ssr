const TOTAL_POKEMONS = 10;
const TOTAL_PAGES = 5;

(async () => {
  const fs = require('fs');

  // pokemons by id
  const pokemonIds = Array.from({ length: TOTAL_POKEMONS }, (_, i) => i + 1);
  let fileContent = pokemonIds.map((id) => `/pokemons/${id}`).join('\n');

  // pokemons by page
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    fileContent += `\n/pokemons/page/${i}`;
  }

  // pokemons by name
  const pokemonNames = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMONS}`
  )
    .then((res) => res.json());
  fileContent += '\n' + pokemonNames.results.map((pokemon) => `/pokemons/${pokemon.name}`).join('\n');

  fs.writeFileSync('routes.txt', fileContent);
})();
