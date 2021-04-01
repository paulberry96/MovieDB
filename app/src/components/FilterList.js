import React from "react";
import { observer } from "mobx-react";
import './FilterList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

function FilterList() {
    return (
        <div className="filter-list-wrapper">
            <div className="filter-list">
                <div className="title">Filters</div>
                <div className="filter-section">
                    <div className="filter-header">
                        <div className="filter-title"><span>Year</span></div>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                    <div className="filter-contents">

                    </div>
                </div>
                <div className="filter-section">
                    <div className="filter-header">
                        <div className="filter-title"><span>Genre</span></div>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                    <div className="filter-contents">

                    </div>
                </div>
                <div className="filter-section">
                    <div className="filter-header">
                        <div className="filter-title"><span>Rating</span></div>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                    <div className="filter-contents">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(FilterList);