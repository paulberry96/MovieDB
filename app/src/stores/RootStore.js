import { createContext, useContext } from "react";
import MovieStore from "./MovieStore";

class RootStore {

    movieStore;

    constructor() {
        this.movieStore = new MovieStore();
    }
}

export default new RootStore();

export const RootStoreContext = createContext();

/* Hook to use store in any functional component */
export const useStore = () => useContext(RootStoreContext);