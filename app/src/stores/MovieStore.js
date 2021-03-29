import { makeObservable, observable, action, toJS } from "mobx";

export default class MovieStore {

    movies = [];

    sort = {
        value: "",
        dir: 0
    };

    viewType = "grid"; // Grid, List

    constructor() {
        makeObservable(this, {
            movies: observable,
            sort: observable,
            viewType: observable,

            setMovies: action,
            sortMovies: action,
            toggleSortDir: action,

            // Possibly for UI Store?
            toggleView: action
        });

        this.fetchMovieData();
    }

    async fetchMovieData() {
        let url = '/api/movies';

        try {
            const response = await fetch(url);
            const movies = await response.json();
            this.setMovies(movies);

            console.log("MOVIES: ", toJS(this.movies));
        }
        catch(err) {
            console.log(err);
        }
    }

    setMovies(movies) {
        this.movies = movies;
    }

    sortMovies = (opt) => {
        this.sort.value = opt.value;
    }

    toggleSortDir = () => {
        this.sort.dir = 1 - this.sort.dir;
    }

    toggleView = () => {
        this.viewType = (this.viewType === "grid" ? "list" : "grid");
    }
}