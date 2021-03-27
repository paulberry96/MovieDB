import React from "react";
import './MovieListItem.css';

export default function MovieListItem(props) {

    const movie = props.data;

    return (
        <div className="movie-list-item">
            {movie.name}
        </div>
    );
}