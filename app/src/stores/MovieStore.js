import { makeObservable, observable, action, toJS } from "mobx";

export default class MovieStore {

    movies = [];

    sort = {
        value: "",
        dir: 0
    };

    constructor() {
        makeObservable(this, {
            movies: observable,
            sort: observable,

            setMovies: action,
            sortMovies: action,
            toggleSortDir: action
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
}