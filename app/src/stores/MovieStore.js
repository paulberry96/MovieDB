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

    filter = {
        loaded: false,
        fields: {
            "Year": { type: 'minmax' },
            "Genre": { type: 'list' },
            "imdbRating": { type: 'minmax' },
            "Runtime": { type: 'minmax' },
            "imdbVotes": { type: 'minmax' },
            "Rated": { type: 'single' },
            "Country": { type: 'list' },
            "Language": { type: 'list' },
            "BoxOffice": { type: 'minmax' }
        },
        currentFilters: []
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
            filter: observable,

            setMovies: action,
            populateFilters: action,
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
        this.populateFilters();
        this.sortMovies();
    }

    populateFilters = () => {
        const movies = this.movies;
        const length = movies.length;
        let i, j, movie, fieldVal, parsedVal;
        for(i = 0; i < length; i++) {
            movie = movies[i];

            for(let [fKey, fObj] of Object.entries(this.filter.fields)) {

                fieldVal = movie[fKey];

                if(fObj.type === 'minmax') {
                    if(fieldVal === "") continue;
                    parsedVal = Number(fieldVal.replace(/([^\d.])/g, ""));
                    if(fObj.min !== undefined || fObj.max !== undefined) {
                        fObj.min = (parsedVal < fObj.min) ? parsedVal : fObj.min;
                        fObj.max = (parsedVal > fObj.max) ? parsedVal : fObj.max;
                    }
                    else {
                        fObj.min = parsedVal;
                        fObj.max = parsedVal;
                    }
                }
                else if(fObj.type === 'list') {
                    if(fObj.values === undefined) fObj.values = {};
                    for(j = 0; j < fieldVal.length; j++) {
                        parsedVal = fieldVal[j].trim();
                        fObj.values[parsedVal] = (fObj.values.hasOwnProperty(parsedVal)) ? fObj.values[parsedVal] + 1 : 1;
                    }
                }
                else if(fObj.type === 'single') {
                    if(fObj.values === undefined) fObj.values = {};
                    parsedVal = fieldVal.trim();
                    fObj.values[parsedVal] = (fObj.values.hasOwnProperty(parsedVal)) ? fObj.values[parsedVal] + 1 : 1;
                }
            }
        }

        this.rootStore.uiStore.initFilterDefaults(this.filter.fields);

        this.filter.loaded = true;
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

    getFilter(field, val) {

        if(!this.filter.fields.hasOwnProperty(field))
            return false;

        if(!this.filter.fields[field].hasOwnProperty(val))
            return false;

        return this.filter.fields[field][val];
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