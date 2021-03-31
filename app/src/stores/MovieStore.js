import { makeObservable, observable, action } from "mobx";

export default class MovieStore {

    movies = [];

    sort = {
        value: "Year",
        dir: 0,
        options: [
            { value: 'Title', label: 'Title', sortDir: 1, enabled: true },
            { value: 'Year', label: 'Year', sortDir: 0, enabled: true },
            { value: 'Genre', label: 'Genre', sortDir: 1, enabled: false },
            { value: 'imdbRating', label: 'Rating', sortDir: 0, enabled: true },
            { value: 'imdbVotes', label: 'Votes', sortDir: 0, enabled: true },
            { value: 'Runtime', label: 'Runtime', sortDir: 0, enabled: true },
            { value: 'Rated', label: 'Rated', sortDir: 0, enabled: true },
            { value: 'dateAdded', label: 'Date Added', sortDir: 0, enabled: true }
        ]
    };

    // United States Ratings
    // https://www.primevideo.com/help/ref=atv_hp_nd_cnt?nodeId=GFGQU3WYEG6FSJFJ
    contentRatings = [
        'TV-Y', 'TV-G', 'G',
        'TV-PG', 'TV-Y7-FV', 'TV-Y7', 'PG',
        'PG-13', 'TV-14',
        'TV-MA', 'R', 'NC-17',
        'Not Rated', 'NR', 'Unrated', 'UR', ''
    ];

    constructor(rootStore) {
        makeObservable(this, {
            movies: observable,
            sort: observable,

            setMovies: action,
            setSortOption: action,
            sortMovies: action,
            toggleSortDir: action,
        });

        this.rootStore = rootStore;

        this.fetchMovieData();
    }

    async fetchMovieData() {

        const url = '/api/movies';

        try {
            const response = await fetch(url);
            const movies = await response.json();
            this.setMovies(movies);
        }
        catch(err) {
            console.log(err);
        }
    }

    setMovies(movies) {
        this.movies = movies;
        this.sortMovies();
    }

    sortMovies = () => {

        const contentRatings = this.contentRatings;

        const field = this.sort.value;
        const dir = this.sort.dir;

        let aV, bV, c;
        this.movies.sort((a, b) => {
            aV = a[field];
            bV = b[field];

            // Parse Content Rating
            if(field === 'Rated') {
                aV = contentRatings.indexOf(aV);
                bV = contentRatings.indexOf(bV);
            }
            else if(field === 'Runtime' || field === 'imdbVotes') {
                aV = parseInt(aV.replace(/,/g, ''), 10) || 0;
                bV = parseInt(bV.replace(/,/g, ''), 10) || 0;
            }

            c = 0;
            if(aV > bV) c = 1;
            if(bV > aV) c = -1;

            c = (dir === 0) ? (c * -1) : c;

            return c;
        });
    }

    setSortOption = (opt) => {

        const sortOption = this.sort.options.find(o => o.value === opt.value);

        if(sortOption.value !== this.sort.value) {
            this.sort.value = sortOption.value;
            this.sort.dir = sortOption.sortDir;

            this.sortMovies();
        }
        else {
            this.toggleSortDir();
        }
    }

    toggleSortDir = () => {
        this.sort.dir = 1 - this.sort.dir;
        this.sortMovies();
    }
}