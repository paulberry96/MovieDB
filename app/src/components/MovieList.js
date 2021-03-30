import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../stores/RootStore";
import Dropdown from "react-dropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountUp, faSortAmountDown, faTh, faList } from '@fortawesome/free-solid-svg-icons';
import 'react-dropdown/style.css';
import MovieListItem from "./MovieListItem";
import './MovieList.css';

const sortOptions = [
	{ value: 'Title', label: 'Title' },
	{ value: 'Year', label: 'Year' },
	{ value: 'imdbRating', label: 'Rating' },
	{ value: 'Runtime', label: 'Runtime' }
];

function MovieList() {

	const { movieStore, uiStore } = useStore();

	return (
		<div className={`movie-list-wrapper ${uiStore.viewType}`}>
			<div className="action-bar">
				<div className="title">
					<h3>{movieStore.movies.length}</h3><span>movies</span>
				</div>
				<div className="actions">
					<div className="view-toggle">
						<button onClick={uiStore.toggleView} className="btn-toggle-view">
							<FontAwesomeIcon icon={uiStore.viewType === "grid-view" ? faTh : faList} />
						</button>
					</div>
					<div className="sort">
						<Dropdown options={sortOptions} onChange={movieStore.sortMovies} value="" placeholder="Sort" />
						<button onClick={movieStore.toggleSortDir} className="btn-sort-dir">
							<FontAwesomeIcon icon={movieStore.sort.dir === 0 ? faSortAmountUp : faSortAmountDown} />
						</button>
					</div>
				</div>
			</div>
			<div className={`movie-list ${uiStore.viewType} v-scroll`}>
				{(uiStore.viewType === "list-view") ?
					<div className="list-header">
						<div>Title</div>
						<div>Year</div>
						<div>Genre</div>
					</div>
				: null}
				{
					movieStore.movies.map(movieData => (
						<MovieListItem key={movieData._id} data={movieData} viewType={uiStore.viewType} />
					))
				}
			</div>
		</div>
	);
}

export default observer(MovieList);