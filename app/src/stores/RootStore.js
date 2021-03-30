import { createContext, useContext } from "react";
import MovieStore from "./MovieStore";
import UIStore from "./UIStore";

class RootStore {

    movieStore;
    uiStore;

    constructor() {
        this.movieStore = new MovieStore(this);
        this.uiStore = new UIStore(this);
    }
}

export default new RootStore();

export const RootStoreContext = createContext();

/* Hook to use store in any functional component */
export const useStore = () => useContext(RootStoreContext);