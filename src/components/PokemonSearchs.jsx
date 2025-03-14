import   { useState, useEffect } from "react";
import styles from './PokemonSearch.module.css'   

const PokemonSearch = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el input
  const [pokemon, setPokemon] = useState(null); // Estado para los datos del Pokémon
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Estado de error

  const fetchPokemon = async (name) => {
    if (!name) return;
    setLoading(true);
    setError("");
    setPokemon(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error("Pokémon no encontrado");
      }
      const result = await response.json();
      setPokemon(result);
    } catch (err) {
      setError("Pokémon no encontrado");
    }
    setLoading(false);
  };

  // Ejecutar la búsqueda automáticamente cuando el usuario escribe
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        fetchPokemon(searchTerm);
      }
    }, 500); // Espera 500ms antes de hacer la petición

    return () => clearTimeout(delayDebounce); // Limpia la búsqueda anterior
  }, [searchTerm]); // Se ejecuta cuando searchTerm cambia

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    fetchPokemon(searchTerm); // Llama a la función de búsqueda manualmente
  };

  return (
    <div className={styles.container}>
      <h1>Buscador de Pokémon</h1>

      {/* Formulario para buscar Pokémon */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa el nombre o ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p className={styles.loading} >Buscando...</p>}
      {error && <p className={styles.error} >{error}</p>}

      {pokemon && (
        <div className={styles.card}>
          <h2>{pokemon.name.toUpperCase()}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p><strong>Tipo:</strong> {pokemon.types.map((t) => t.type.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default PokemonSearch;
