const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
};

const url = "https://pokeapi.co/api/v2/pokemon/";
const card = document.getElementById("card");
const btn = document.getElementById("btn");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const staticData = [
  { id: 1, name: "Carta A", content: "Contenido de la carta A." },
  { id: 2, name: "Carta B", content: "Contenido de la carta B." },
  { id: 3, name: "Carta C", content: "Contenido de la carta C." },
];

// Función para generar una carta desde datos estáticos o dinámicos
let generateCard = (data, isStatic = false) => {
  if (isStatic) {
    card.innerHTML = `
      <h2>${data.name}</h2>
      <p>${data.content}</p>
    `;
    card.style.background = "white";
    card.style.color = "black";
  } else {
    const hp = data.stats[0].base_stat;
    const imgSrc = data.sprites.other.dream_world.front_default || data.sprites.front_default;
    const pokeName = data.name[0].toUpperCase() + data.name.slice(1);
    const statAttack = data.stats[1].base_stat;
    const statDefense = data.stats[2].base_stat;
    const statSpeed = data.stats[5].base_stat;
    const themeColor = typeColor[data.types[0].type.name];

    card.innerHTML = `
      <p class="hp"><span>HP</span> ${hp}</p>
      <img src=${imgSrc} alt="${pokeName}" />
      <h2 class="poke-name">${pokeName}</h2>
      <div class="types"></div>
      <div class="stats">
        <div>
          <h3>${statAttack}</h3>
          <p>Attack</p>
        </div>
        <div>
          <h3>${statDefense}</h3>
          <p>Defense</p>
        </div>
        <div>
          <h3>${statSpeed}</h3>
          <p>Speed</p>
        </div>
      </div>
    `;
    appendTypes(data.types);
    styleCard(themeColor);
  }
};

// Agregar tipos a la carta
let appendTypes = (types) => {
  document.querySelector(".types").innerHTML = types
    .map((type) => `<span style="background-color: ${typeColor[type.type.name]};">${type.type.name}</span>`)
    .join("");
};

// Estilizar la carta
let styleCard = (color) => {
  card.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ffffff 36%)`;
};

// Generar un Pokémon aleatorio
let getPokeData = () => {
  let id = Math.floor(Math.random() * 150) + 1;
  fetch(`${url}${id}`)
    .then((response) => response.json())
    .then((data) => generateCard(data))
    .catch(() => {
      card.innerHTML = "<p>Error al cargar el Pokémon. Intenta nuevamente.</p>";
    });
};

// Buscar por nombre o ID
searchButton.addEventListener("click", async () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (!searchTerm) {
    card.innerHTML = "<p>Por favor, ingresa un término de búsqueda.</p>";
    return;
  }

  // Buscar en datos estáticos
  const staticResult = staticData.find(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) || item.id === parseInt(searchTerm)
  );

  if (staticResult) {
    generateCard(staticResult, true);
    return;
  }

  // Buscar en la API de Pokémon
  try {
    const response = await fetch(`${url}${searchTerm}`);
    if (!response.ok) throw new Error("No se encontró el Pokémon");
    const data = await response.json();
    generateCard(data);
  } catch (error) {
    console.error(error);
    card.innerHTML = "<p>No se encontró ninguna carta o Pokémon.</p>";
  }
});

// Evento para generar Pokémon aleatorio al cargar la página
btn.addEventListener("click", getPokeData);
window.addEventListener("load", getPokeData);
