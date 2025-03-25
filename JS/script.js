// Seleciona os elementos do DOM
const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_img');
const pokemonShiny = document.querySelector('.shiny_img');
const pokemonGen = document.querySelector('.pokemon_gen');
const pokemonWeight = document.querySelector('.pokemon_weight');
const pokemonHeight = document.querySelector('.pokemon_height');
const pokemonType1 = document.querySelector('.pokemon_type1');
const pokemonType2 = document.querySelector('.pokemon_type2');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonRandom = document.querySelector('.btn-random');

let searchPokemon = 1; // Inicializa a variável com o ID do Pokémon a ser buscado

// Função assíncrona para buscar dados do Pokémon na API
const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (APIResponse.status == 200) {
        const data = await APIResponse.json();
        return data;
    }
}

// Função assíncrona para buscar dados da espécie do Pokémon na API
const fetchPokemonSpecies = async (pokemonId) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    if (APIResponse.status == 200) {
        const data = await APIResponse.json();
        return data;
    }
}

// Função assíncrona para renderizar os dados do Pokémon na página
const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Loading...'; // Exibe "Loading..." enquanto os dados são carregados
    pokemonNumber.innerHTML = '';
    const data = await fetchPokemon(pokemon); // Busca os dados do Pokémon
    if (data) {
        // Atualiza os elementos do DOM com os dados do Pokémon
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        pokemonShiny.src = data['sprites']['versions']['generation-v']['black-white']['front_shiny'];
        
        // Busca os dados da espécie do Pokémon para obter a geração
        const speciesData = await fetchPokemonSpecies(data.id);
        if (speciesData) {
            const generation = speciesData.generation.name.replace('generation-', '').toUpperCase();
            pokemonGen.innerHTML = `Generation: ${generation}`;
        } else {
            pokemonGen.innerHTML = '';
        }
        
        // Extrai e exibe o peso e a altura do Pokémon
        const weight = data.weight / 10; // Peso em kg
        const height = data.height / 10; // Altura em metros
        pokemonWeight.innerHTML = `${weight} kg`;
        pokemonHeight.innerHTML = `${height} m`;

        // Extrai e exibe os tipos do Pokémon em elementos separados
        const types = data.types.map(typeInfo => typeInfo.type.name);
        pokemonType1.innerHTML = types[0] ? `${types[0]}` : '';
        pokemonType2.innerHTML = types[1] ? `${types[1]}` : '';

        // Limpa o input após a busca
        input.value = '';
        searchPokemon = data.id;
    } else {
        // Exibe mensagem de "Not found" se o Pokémon não for encontrado
        pokemonImage.style.display = '';
        pokemonShiny.style.display = '';
        pokemonName.innerHTML = 'Not found';
        pokemonNumber.innerHTML = '';
        pokemonGen.innerHTML = '';
        pokemonWeight.innerHTML = '';
        pokemonHeight.innerHTML = '';
        pokemonType1.innerHTML = '';
        pokemonType2.innerHTML = '';
    }
    // Atualiza a imagem para Pokémon da geração VIII
    if (data.id > 649) {
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-viii']['icons']['front_default'];
        pokemonImage.style.height = '25%';
    }
    if (data.id < 649) {
        pokemonImage.style.height = '20%';
    }
    // Exibe mensagem de "Not found" se o ID do Pokémon for maior que 898
    if (data.id > 898) {
        pokemonImage.style.display = '';
        pokemonName.innerHTML = 'Not found';
        pokemonNumber.innerHTML = '';
        pokemonGen.innerHTML = '';
        pokemonWeight.innerHTML = '';
        pokemonHeight.innerHTML = '';
        pokemonType1.innerHTML = '';
        pokemonType2.innerHTML = '';
    }
}

// Função para gerar um ID de Pokémon aleatório entre 1 e 898
function RandomID(min, max) {
    min = Math.ceil(1);
    max = Math.floor(898);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Adiciona um evento de clique ao botão "Random"
buttonRandom.addEventListener('click', () => {
    searchPokemon = RandomID();
    renderPokemon(searchPokemon);
});

// Adiciona um evento de submit ao formulário
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    renderPokemon(input.value.toLowerCase()); // Renderiza o Pokémon baseado no valor do input
});

// Adiciona um evento de clique ao botão "Prev"
buttonPrev.addEventListener('click', () => {
    searchPokemon -= 1; // Decrementa o ID do Pokémon
    if (searchPokemon < 1) {
        searchPokemon = 898; // Se o ID for menor que 1, volta para o último Pokémon
        pokemonImage.style.display = '898';
        renderPokemon(searchPokemon);
    }
    renderPokemon(searchPokemon); // Renderiza o Pokémon anterior
});

// Adiciona um evento de clique ao botão "Next"
buttonNext.addEventListener('click', () => {
    searchPokemon += 1; // Incrementa o ID do Pokémon
    if (searchPokemon > 898) {
        searchPokemon = 1; // Se o ID for maior que 898, volta para o primeiro Pokémon
        renderPokemon(searchPokemon);
    }
    renderPokemon(searchPokemon); // Renderiza o próximo Pokémon
});

// Renderiza o Pokémon inicial
renderPokemon(searchPokemon);