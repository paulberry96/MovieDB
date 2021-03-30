import React from "react";
import { useStore } from "../stores/RootStore";
import './MovieListItem.css';

function selectGenre(e) {
    console.log(e);
}

function selectYear(e) {
    console.log(e);
}

export default function MovieListItem(props) {

    const movie = props.data;
    const viewType = props.viewType;
    const thumbnail = `/thumbs/${movie.imdbID}.jpg`;

    if(viewType === "grid-view") {
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
                        {movie.Genre.map((genre, i) => {
                            return (
                                <div key={genre} onClick={() => selectGenre(genre)}>
                                    <span>{genre}</span>{i < movie.Genre.length - 1 ? <i>|</i> : null}
                                </div>
                            )
                        })}
                    </div>
                    <div className="additional-details">
                        <div className="year" onClick={() => selectYear(movie.Year)}>
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
    else if(viewType === "list-view") {
        return (
            <div className="movie-list-item">
                <div className="title">
                    {movie.name}
                </div>
                <div className="year">
                    {movie.Year}
                </div>
                <div className="genre">
                    {movie.Genre.map((genre, i) => {
                        return (
                            <div key={genre} onClick={() => selectGenre(genre)}>
                                <span>{genre}</span>{i < movie.Genre.length - 1 ? <i>,&nbsp;</i> : null}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}