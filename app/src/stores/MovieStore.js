import { makeObservable, observable, action, toJS } from "mobx";

export default class MovieStore {

    movies = [];

    constructor() {
        makeObservable(this, {
            movies: observable,

            setMovies: action
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
}