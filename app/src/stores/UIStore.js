import { makeObservable, observable, action } from "mobx";

export default class UIStore {

    viewType = "grid-view"; // grid-view, list-view
    filterListShown = true;
    filterValues = {};

    constructor(rootStore) {
        makeObservable(this, {
            viewType: observable,
            filterListShown: observable,
            filterValues: observable,

            toggleView: action,
            toggleFilters: action,
            resetAllFilters: action,
            initFilterDefaults: action,
            onFilterValueChange: action
        });

        this.rootStore = rootStore;
    }

    toggleView = () => {
        this.viewType = (this.viewType === "grid-view" ? "list-view" : "grid-view");
    }

    toggleFilters = () => {
        this.filterListShown = !this.filterListShown;
    }

    resetAllFilters = () => {
        this.initFilterDefaults(this.rootStore.movieStore.filter.fields);
        this.rootStore.movieStore.updateFilters(this.filterValues);
    }

    initFilterDefaults = (fields) => {
        for(let [fKey, fObj] of Object.entries(fields)) {
            if(fObj['type'] === "minmax") {
                this.filterValues[fKey] = [fObj.min, fObj.max];
            }
            else if(fObj['type'] === 'single' || fObj['type'] === 'list') {
                this.filterValues[fKey] = [];
            }
        }
    }

    onFilterValueChange(filter, value, update) {
        this.filterValues[filter] = value;

        if(update)
            this.rootStore.movieStore.updateFilters(this.filterValues);
    }
}