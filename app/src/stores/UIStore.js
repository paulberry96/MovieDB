import { makeObservable, observable, action } from "mobx";

export default class UIStore {

    viewType = "grid-view"; // grid-view, list-view
    filtersShown = false;

    constructor(rootStore) {
        makeObservable(this, {
            viewType: observable,
            filtersShown: observable,

            toggleView: action,
            toggleFilters: action
        });

        this.rootStore = rootStore;
    }

    toggleView = () => {
        this.viewType = (this.viewType === "grid-view" ? "list-view" : "grid-view");
    }

    toggleFilters = () => {
        this.filtersShown = !this.filtersShown;
    }
}