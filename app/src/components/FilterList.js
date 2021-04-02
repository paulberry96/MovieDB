import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../stores/RootStore";
import './FilterList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

function FilterList() {

    const { movieStore, uiStore } = useStore();

    return (
        <div className="filter-list-wrapper">
            {(movieStore.filter.loaded) ?
                <div className="filter-list">
                    <div className="title">Filters</div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title">
                                <span>Year</span>
                            </div>
                        </div>
                        <div className="filter-contents">
                            <div className="slider-wrapper">
                                <Range allowCross={true}
                                    min={movieStore.filter.fields.Year.min}
                                    max={movieStore.filter.fields.Year.max}
                                    defaultValue={[movieStore.filter.fields.Year.min, movieStore.filter.fields.Year.max]}
                                    onChange={(val) => { uiStore.onFilterValueChange("Year", val) }} />
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
                        </div>
                        <div className="filter-contents">

                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="filter-header">
                            <div className="filter-title"><span>Rating</span></div>
                        </div>
                        <div className="filter-contents">

                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
}

export default observer(FilterList);