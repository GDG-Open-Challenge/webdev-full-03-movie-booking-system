import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MovieList.css";

function MovieList({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const isPast = new Date(movie.showtime) < new Date();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/movies");
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading movies...</div>;

  return (
    <div className="container">
      <h2>Available Movies</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <div className="movie-poster">
              <img
                src={movie.posterUrl || "https://via.placeholder.com/200x300"}
                alt={movie.title}
              />
            </div>
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p className="genre">{movie.genre}</p>
              <p className="description">{movie.description}</p>
              <p className="price">₹{movie.price}</p>
              <p className="showtime">
                {new Date(movie.showtime).toLocaleString()}
              </p>
              <button onClick={() => onSelectMovie(movie)} disabled={isPast}>
                {isPast ? "Show Ended" : "Book Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
