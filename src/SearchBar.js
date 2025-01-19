import React, { useState, useEffect } from 'react';
import client from './meilisearchClient';
import './index.css'; // Importa el archivo CSS

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const searchResults = await client.index('movies').search(query, {
            limit: 15,
          });
          setResults(searchResults.hits);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setResults([]);
      }
    };

    const debounceFetch = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceFetch);
  }, [query]);

  return (
    <div className="search-container">
      <h1 className="search-title">BuscaPelis.com</h1>
      <input
        type="text"
        placeholder="Busca una película..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <div className="results-container">
        {results.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-image">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} />
              ) : (
                <div className="movie-placeholder">Sin Imagen</div>
              )}
            </div>
            <div className="movie-details">
              <h2 className="movie-title">{movie.title}</h2>
              <p>
                <strong>ID:</strong> {movie.id}
              </p>
              <p>
                <strong>Fecha de Lanzamiento:</strong>{' '}
                {new Date(movie.release_date * 1000).toLocaleDateString()}
              </p>
              <p>
                <strong>Género:</strong>{' '}
                {movie.genres ? movie.genres.join(', ') : 'Desconocido'}
              </p>
              <p className="movie-overview">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
