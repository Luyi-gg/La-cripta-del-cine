import React from "react";

export default function MovieCard({ pelicula }) {
  return (
    <div className="movie-card">
      <img src={pelicula.poster} alt={pelicula.titulo} />
      <h3>{pelicula.titulo}</h3>
      <p>{pelicula.anio}</p>
    </div>
  );
}
