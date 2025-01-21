import React, { useState, useEffect } from 'react';
import './index.css'; 
import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: 'http://172.235.40.99',
  apiKey: 'd34953ae0c72685286134cc80a7578e91be834ea018ef2a4a6340f8a83f2', 
});


const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
          const searchResults = await client.index('movies').search(query, {
            limit: 10,
          });
          setResults(searchResults.hits);
    
      } else {
        setResults([]);
      }
    };

    const debounceFetch = setTimeout(fetchResults, 300);
    return () => (debounceFetch);
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
              <img src={movie.poster} alt={movie.title} />
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
                {movie.genres}
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
