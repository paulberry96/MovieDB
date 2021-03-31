import { makeObservable, observable, action } from "mobx";

export default class MovieStore {

    movies = [];

    sort = {
        value: "",
        dir: 0,
        options: [
            { value: 'Title', label: 'Title', sortDir: 0 },
            { value: 'Year', label: 'Year', sortDir: 1 },
            { value: 'imdbRating', label: 'Rating', sortDir: 1 },
            { value: 'imdbVotes', label: 'Votes', sortDir: 1 },
            { value: 'Runtime', label: 'Runtime', sortDir: 1 },
            { value: 'Rated', label: 'Rated', sortDir: 1 },
            { value: 'dateAdded', label: 'Date Added', sortDir: 1 }
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
    }

    sortMovies = (opt) => {

        let field;

        if(!opt || !opt.value)
            field = this.sort.value || "Title";
        else
            field = opt.value;

        this.sort.value = field;

        const contentRatings = this.contentRatings;

        const dir = this.sort.dir ^ this.sort.options.find(opt => opt.value === field).sortDir;

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

            c = (dir === 1) ? (c * -1) : c;

            return c;
        });
    }

    toggleSortDir = () => {
        this.sort.dir = 1 - this.sort.dir;
        this.sortMovies();
    }
}