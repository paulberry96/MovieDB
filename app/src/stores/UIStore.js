import { makeObservable, observable, action } from "mobx";

export default class UIStore {

    viewType = "grid-view"; // grid-view, list-view
    filtersShown = false;
    filterValues = {};

    constructor(rootStore) {
        makeObservable(this, {
            viewType: observable,
            filtersShown: observable,
            filterValues: observable,

            toggleView: action,
            toggleFilters: action,
            initFilterDefaults: action,
            onFilterValueChange: action
        });

        this.rootStore = rootStore;
    }

    toggleView = () => {
        this.viewType = (this.viewType === "grid-view" ? "list-view" : "grid-view");
    }

    toggleFilters = () => {
        this.filtersShown = !this.filtersShown;
    }

    initFilterDefaults = (fields) => {
        for(let [fKey, fObj] of Object.entries(fields)) {

            this.filterValues[fKey] = {};

            if(fObj['type'] === "minmax") {
                this.filterValues[fKey] = [fObj.min, fObj.max];
            }
            else if(fObj['type'] === 'single' || fObj['type'] === 'list') {
                this.filterValues[fKey] = [];
            }
        }
    }

    onFilterValueChange(filter, value) {
        this.filterValues[filter] = value;
    }

    getFilterValue(filter) {
        if(!this.filterValues.hasOwnProperty(filter))
            return false;

        return this.filterValues[filter];
    }
}