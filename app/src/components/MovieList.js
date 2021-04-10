import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../stores/RootStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList, faFilter, faSortAmountUp, faSortAmountDownAlt, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import MovieListItem from "./MovieListItem";
import './MovieList.css';
import FilterList from "./FilterList";

import Dropdown from "./Dropdown";

function MovieList() {

	const { movieStore, uiStore } = useStore();

	const sortOptions = movieStore.sort.options.filter(opt => opt.enabled === true);

	const movies = movieStore.movies.filter(movie => movie.shown !== false);

	return (
		<div className={`movie-list-wrapper ${uiStore.viewType}`}>
			<div className="section-left">
				{uiStore.filterListShown ?
					<FilterList />
					: null
				}
			</div>
			<div className="section-right">
				<div className="action-bar">
					<div className="title">
						<div>{movies.length}</div><span>movies</span>
					</div>
					<div className="actions">
						<div className="view-toggle">
							<button onClick={uiStore.toggleView} className={`btn btn-toggle-view${uiStore.viewType === "grid-view" ? " selected" : ""}`}>
								<FontAwesomeIcon icon={faTh} />
							</button>
							<button onClick={uiStore.toggleView} className={`btn btn-toggle-view${uiStore.viewType === "list-view" ? " selected" : ""}`}>
								<FontAwesomeIcon icon={faList} />
							</button>
						</div>
						<div className="filter">
							<button onClick={uiStore.toggleFilters} className={`btn${uiStore.filterListShown ? " selected" : ""}`}>
								<FontAwesomeIcon icon={faFilter} />
							</button>
						</div>
						<div className="sort">
							<Dropdown options={sortOptions} onChange={movieStore.setSortOption} value={movieStore.sort.value} defaultValue="Year" placeholder="Sort" />
							<button onClick={movieStore.toggleSortDir} className="btn btn-sort-dir">
								<FontAwesomeIcon icon={movieStore.sort.dir === 1 ? faSortAmountDownAlt : faSortAmountUp} />
							</button>
						</div>
					</div>
				</div>
				<div className={`movie-list-container v-scroll ${uiStore.viewType}`}>
					<div className={`movie-list ${uiStore.viewType}`}>
						{(uiStore.viewType === "list-view") ?
							<div className="list-header">
								{
									movieStore.sort.options.map(opt => (
										<div
											key={opt.value}
											onClick={() => { if(opt.enabled) movieStore.setSortOption(opt); }}
											className={`${opt.enabled ? "sortable" : ""}`}>
											<span>{opt.label}</span>
											{opt.value === movieStore.sort.value ?
												<FontAwesomeIcon className="sortArrow" icon={(movieStore.sort.dir === 0) ? faArrowUp : faArrowDown} />
												: null
											}
										</div>
									))
								}
							</div>
							: null
						}
						{
							movies.map(movieData => (
								<MovieListItem
								key={movieData._id}
								data={movieData}
								viewType={uiStore.viewType} />
							))
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export default observer(MovieList);