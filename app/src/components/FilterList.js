import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../stores/RootStore";
import './FilterList.css';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import Dropdown from "./Dropdown";

function nFormatter(num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for(i = si.length - 1; i > 0; i--) {
        if(num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function FilterList() {

    const { movieStore, uiStore } = useStore();

    const filters = movieStore.filter.fields;
    const currentFilters = movieStore.filter.current;
    const uiFilters = uiStore.filterValues;

    const loaded = movieStore.filter.loaded;

    return (
        <div className="filter-list-wrapper">
            {(loaded) ?
                <div className="filter-list v-scroll">
                    <div className="title">
                        <span>Filters</span>
                        <button className="btn" onClick={uiStore.clearAllFilters}>Clear all</button>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Year</span></div>
                            {(currentFilters.hasOwnProperty("Year")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Year") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={filters.Year.min}
                                    max={filters.Year.max}
                                    value={uiFilters.Year}
                                    defaultValue={[filters.Year.min, filters.Year.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("Year", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("Year", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{uiFilters.Year[0]}</span>
                                <span>{uiFilters.Year[1]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Genre</span></div>
                            {(currentFilters.hasOwnProperty("Genre")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Genre") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <Dropdown
                                options={filters.Genre.values}
                                value={uiFilters.Genre}
                                onChange={(val) => { uiStore.onFilterValueChange('Genre', val, true) }}
                                placeholder="Select Genre"
                                menuClassName="v-scroll v-scroll-auto"
                                searchable multi showCount />
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Rating</span></div>
                            {(currentFilters.hasOwnProperty("imdbRating")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("imdbRating") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={filters.imdbRating.min}
                                    max={filters.imdbRating.max}
                                    step={0.1}
                                    value={uiFilters.imdbRating}
                                    defaultValue={[filters.imdbRating.min, filters.imdbRating.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("imdbRating", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("imdbRating", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{uiFilters.imdbRating[0]}</span>
                                <span>{uiFilters.imdbRating[1]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Runtime</span></div>
                            {(currentFilters.hasOwnProperty("Runtime")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Runtime") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={filters.Runtime.min}
                                    max={filters.Runtime.max}
                                    value={uiFilters.Runtime}
                                    defaultValue={[filters.Runtime.min, filters.Runtime.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("Runtime", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("Runtime", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{uiFilters.Runtime[0]} mins</span>
                                <span>{uiFilters.Runtime[1]} mins</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Votes</span></div>
                            {(currentFilters.hasOwnProperty("imdbVotes")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("imdbVotes") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={filters.imdbVotes.min}
                                    max={filters.imdbVotes.max}
                                    step={1000}
                                    value={uiFilters.imdbVotes}
                                    defaultValue={[filters.imdbVotes.min, filters.imdbVotes.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("imdbVotes", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("imdbVotes", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{nFormatter(uiFilters.imdbVotes[0], 1)}</span>
                                <span>{nFormatter(uiFilters.imdbVotes[1], 1)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Rated</span></div>
                            {(currentFilters.hasOwnProperty("Rated")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Rated") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <Dropdown
                                options={filters.Rated.values}
                                value={uiFilters.Rated}
                                onChange={(val) => { uiStore.onFilterValueChange('Rated', val, true) }}
                                placeholder="Select Rating"
                                menuClassName="v-scroll v-scroll-auto"
                                showCount />
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Country</span></div>
                            {(currentFilters.hasOwnProperty("Country")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Country") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <Dropdown
                                options={filters.Country.values}
                                value={uiFilters.Country}
                                onChange={(val) => { uiStore.onFilterValueChange('Country', val, true) }}
                                placeholder="Select Country"
                                menuClassName="v-scroll v-scroll-auto"
                                searchable multi showCount />
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Language</span></div>
                            {(currentFilters.hasOwnProperty("Language")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Language") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <Dropdown
                                options={filters.Language.values}
                                value={uiFilters.Language}
                                onChange={(val) => { uiStore.onFilterValueChange('Language', val, true) }}
                                placeholder="Select Language"
                                menuClassName="v-scroll v-scroll-auto"
                                searchable multi showCount />
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Box Office</span></div>
                            {(currentFilters.hasOwnProperty("BoxOffice")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("BoxOffice") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={filters.BoxOffice.min}
                                    max={filters.BoxOffice.max}
                                    step={1000000}
                                    value={uiFilters.BoxOffice}
                                    defaultValue={[filters.BoxOffice.min, filters.BoxOffice.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("BoxOffice", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("BoxOffice", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{"$" + nFormatter(uiFilters.BoxOffice[0], 1)}</span>
                                <span>{"$" + nFormatter(uiFilters.BoxOffice[1], 1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
}

export default observer(FilterList);