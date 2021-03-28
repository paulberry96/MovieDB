import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../stores/RootStore";
import Dropdown from "react-dropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountUp, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import 'react-dropdown/style.css';
import MovieListItem from "./MovieListItem";
import './MovieList.css';

const sortOptions = [
    { value: 'Title', label: 'Title' },
    { value: 'Year', label: 'Year' },
    { value: 'imdbRating', label: 'Rating' },
    { value: 'Runtime', label: 'Runtime' },
];

function MovieList() {

    const { movieStore } = useStore();

    return (
        <div className="movie-list-wrapper">
            <div className="action-bar">
                <div className="title">
                    <h3>{movieStore.movies.length}</h3><span>movies</span>
                </div>
                <div className="actions">
                    <Dropdown options={sortOptions} onChange={movieStore.sortMovies} value="" placeholder="Sort" />
                    <button onClick={movieStore.toggleSortDir} className="btn-sort-dir">
                        <FontAwesomeIcon icon={movieStore.sort.dir === 0 ? faSortAmountUp : faSortAmountDown} />
                    </button>
                </div>
            </div>
            <div className="movie-list">
                {
                    movieStore.movies.map(movieData => (
                        <MovieListItem key={movieData._id} data={movieData} />
                    ))
                }
            </div>
        </div>
    );
}

export default observer(MovieList);