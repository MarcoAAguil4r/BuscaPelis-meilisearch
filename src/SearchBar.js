import React, { useState, useEffect } from 'react';
import client from './meilisearchClient';

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

    const debounceFetch = setTimeout(fetchResults, 30); 
    return () => clearTimeout(debounceFetch); 
  }, [query]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>BuscaPelis.com</h1>
      <input
        type="text"
        placeholder="Busca una pelicula..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '100%',
          maxWidth: '400px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <div>
        {results.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '10px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '15px',
            }}
          >
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                style={{ width: '80px', height: '120px', borderRadius: '5px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '120px',
                  backgroundColor: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '5px',
                  color: '#fff',
                }}
              >
                Sin Imagen
              </div>
            )}
            <div>
              <h2 style={{ margin: '0 0 10px' }}>{movie.title}</h2>
              <p style={{ margin: '0 0 5px' }}>
                <strong>ID:</strong> {movie.id}
              </p>
              <p style={{ margin: '0 0 5px' }}>
                <strong>Fecha de Lanzamiento:</strong> {new Date(movie.release_date * 1000).toLocaleDateString()}
              </p>
              <p style={{ margin: '0 0 5px' }}>
                <strong>Genero:</strong> {movie.genres ? movie.genres.join(', ') : 'Unknown'}
              </p>
              <p style={{ margin: '0' }}>{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
