import React from "react";
import './MovieListItem.css';

export default function MovieListItem(props) {

    const movie = props.data;
    const thumbnail = `/thumbs/${movie._id}.jpg`;

    return (
        <div className="movie-list-item">
            <div className="image">
                <img src={thumbnail} alt={movie.name} />
                <div className="rating">
                    {movie.imdbRating}
                </div>
            </div>
            <div className="details">
                <div className="title">
                    {movie.Title}
                </div>
                <div className="genre">
                    {movie.Genre}
                </div>
                <div className="additional-details">
                    <div className="year">
                        {movie.Year}
                    </div>
                    <div className="runtime">
                        {movie.Runtime}
                    </div>
                </div>
            </div>
        </div>
    );
}