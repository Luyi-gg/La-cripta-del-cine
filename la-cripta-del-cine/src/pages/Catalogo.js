import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import data from "../data/movies.json";

export default function Catalogo() {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    setPeliculas(data);
  }, []);

  return (
    <div className="catalogo">
      {peliculas.map(p => <MovieCard key={p.id} pelicula={p} />)}
    </div>
  );
}
