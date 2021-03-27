import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../stores/RootStore";
import MovieListItem from "./MovieListItem";
import './MovieList.css';

function MovieList() {

    const { movieStore } = useStore();

    return (
        <div className="movie-list">
            {
                movieStore.movies.map(movieData => (
                    <MovieListItem key={movieData._id} data={movieData} />
                ))
            }
        </div>
    );
}

export default observer(MovieList);