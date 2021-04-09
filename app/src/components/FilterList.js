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

    return (
        <div className="filter-list-wrapper">
            {(movieStore.filter.loaded) ?
                <div className="filter-list v-scroll">
                    <div className="title">
                        <span>Filters</span>
                        <button className="btn" onClick={uiStore.clearAllFilters}>Clear all</button>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Year</span></div>
                            {(movieStore.filter.current.hasOwnProperty("Year")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Year") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={movieStore.filter.fields.Year.min}
                                    max={movieStore.filter.fields.Year.max}
                                    value={uiStore.filterValues.Year}
                                    defaultValue={[movieStore.filter.fields.Year.min, movieStore.filter.fields.Year.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("Year", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("Year", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{uiStore.filterValues.Year[0]}</span>
                                <span>{uiStore.filterValues.Year[1]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Genre</span></div>
                            {(movieStore.filter.current.hasOwnProperty("Genre")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Genre") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <Dropdown
                                options={movieStore.filter.fields.Genre.values}
                                value={uiStore.filterValues.Genre}
                                onChange={(val) => { uiStore.onFilterValueChange('Genre', val, true) }}
                                placeholder="Select Genre"
                                menuClassName="v-scroll v-scroll-auto"
                                searchable multi />
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Rating</span></div>
                            {(movieStore.filter.current.hasOwnProperty("imdbRating")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("imdbRating") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={movieStore.filter.fields.imdbRating.min}
                                    max={movieStore.filter.fields.imdbRating.max}
                                    step={0.1}
                                    value={uiStore.filterValues.imdbRating}
                                    defaultValue={[movieStore.filter.fields.imdbRating.min, movieStore.filter.fields.imdbRating.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("imdbRating", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("imdbRating", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{uiStore.filterValues.imdbRating[0]}</span>
                                <span>{uiStore.filterValues.imdbRating[1]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Runtime</span></div>
                            {(movieStore.filter.current.hasOwnProperty("Runtime")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Runtime") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={movieStore.filter.fields.Runtime.min}
                                    max={movieStore.filter.fields.Runtime.max}
                                    value={uiStore.filterValues.Runtime}
                                    defaultValue={[movieStore.filter.fields.Runtime.min, movieStore.filter.fields.Runtime.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("Runtime", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("Runtime", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{uiStore.filterValues.Runtime[0]} mins</span>
                                <span>{uiStore.filterValues.Runtime[1]} mins</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Votes</span></div>
                            {(movieStore.filter.current.hasOwnProperty("imdbVotes")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("imdbVotes") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={movieStore.filter.fields.imdbVotes.min}
                                    max={movieStore.filter.fields.imdbVotes.max}
                                    step={1000}
                                    value={uiStore.filterValues.imdbVotes}
                                    defaultValue={[movieStore.filter.fields.imdbVotes.min, movieStore.filter.fields.imdbVotes.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("imdbVotes", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("imdbVotes", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{nFormatter(uiStore.filterValues.imdbVotes[0], 1)}</span>
                                <span>{nFormatter(uiStore.filterValues.imdbVotes[1], 1)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Rated</span></div>
                            {(movieStore.filter.current.hasOwnProperty("Rated")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Rated") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <Dropdown
                                options={movieStore.filter.fields.Rated.values}
                                value={uiStore.filterValues.Rated}
                                onChange={(val) => { uiStore.onFilterValueChange('Rated', val, true) }}
                                placeholder="Select Rating"
                                menuClassName="v-scroll v-scroll-auto" />
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Country</span></div>
                            {(movieStore.filter.current.hasOwnProperty("Country")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Country") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <Dropdown
                                options={movieStore.filter.fields.Country.values}
                                value={uiStore.filterValues.Country}
                                onChange={(val) => { uiStore.onFilterValueChange('Country', val, true) }}
                                placeholder="Select Country"
                                menuClassName="v-scroll v-scroll-auto"
                                searchable multi />
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Language</span></div>
                            {(movieStore.filter.current.hasOwnProperty("Language")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("Language") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <Dropdown
                                options={movieStore.filter.fields.Language.values}
                                value={uiStore.filterValues.Language}
                                onChange={(val) => { uiStore.onFilterValueChange('Language', val, true) }}
                                placeholder="Select Language"
                                menuClassName="v-scroll v-scroll-auto"
                                searchable multi />
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Box Office</span></div>
                            {(movieStore.filter.current.hasOwnProperty("BoxOffice")) ?
                                <div className="filter-reset" onClick={() => { uiStore.clearFilter("BoxOffice") }}>
                                    <span>Clear</span>
                                </div>
                                : null
                            }
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={movieStore.filter.fields.BoxOffice.min}
                                    max={movieStore.filter.fields.BoxOffice.max}
                                    step={1000000}
                                    value={uiStore.filterValues.BoxOffice}
                                    defaultValue={[movieStore.filter.fields.BoxOffice.min, movieStore.filter.fields.BoxOffice.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("BoxOffice", val) }}
                                    onAfterChange={(val) => { uiStore.onFilterValueChange("BoxOffice", val, true) }} />
                            </div>
                            <div className="slider-values">
                                <span>{"$" + nFormatter(uiStore.filterValues.BoxOffice[0], 1)}</span>
                                <span>{"$" + nFormatter(uiStore.filterValues.BoxOffice[1], 1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
}

export default observer(FilterList);