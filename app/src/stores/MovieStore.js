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
            "Genre": { type: 'list', emptyVal: "- None -" },
            "imdbRating": { type: 'minmax', emptyVal: 0 },
            "Runtime": { type: 'minmax' },
            "imdbVotes": { type: 'minmax' },
            "Rated": { type: 'single', emptyVal: "Unrated" },
            "Country": { type: 'list', emptyVal: "- None -" },
            "Language": { type: 'list', emptyVal: "- None -" },
            "BoxOffice": { type: 'minmax' }
        },
        current: {}
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
            updateFilters: action,
            applyFilters: action,
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

        let i, j, movie, fieldVal, parsedVal, foundObj;
        for(i = 0; i < length; i++) {
            movie = movies[i];

            for(let [fKey, fObj] of Object.entries(this.filter.fields)) {

                fieldVal = movie[fKey];

                if(fObj.type === 'minmax') {
                    if(fieldVal[j] !== "" || fObj.emptyVal === undefined)
                        parsedVal = Number(fieldVal.replace(/([^\d.])/g, ""));
                    else
                        parsedVal = fObj.emptyVal;

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
                    if(fObj.values === undefined) fObj.values = [];

                    if(fieldVal.length === 0 && fObj.emptyVal !== undefined) {
                        foundObj = fObj.values.find(o => o.value === fObj.emptyVal);
                        if(foundObj)
                            foundObj.count++;
                        else
                            fObj.values.push({ value: fObj.emptyVal, label: fObj.emptyVal, count: 1 });

                        continue;
                    }

                    for(j = 0; j < fieldVal.length; j++) {

                        parsedVal = fieldVal[j].trim();

                        if(parsedVal === "") continue;

                        foundObj = fObj.values.find(o => o.value === parsedVal);
                        if(foundObj)
                            foundObj.count++;
                        else
                            fObj.values.push({ value: parsedVal, label: parsedVal, count: 1 });
                    }
                }
                else if(fObj.type === 'single') {
                    if(fObj.values === undefined) fObj.values = [];

                    if(fieldVal.trim() !== "" || fObj.emptyVal === undefined)
                        parsedVal = fieldVal.trim();
                    else
                        parsedVal = fObj.emptyVal;

                    foundObj = fObj.values.find(o => o.value === parsedVal);
                    if(foundObj)
                        foundObj.count++;
                    else
                        fObj.values.push({ value: parsedVal, label: parsedVal, count: 1 });
                }
            }
        }

        this.rootStore.uiStore.initFilterDefaults(this.filter.fields);

        this.filter.loaded = true;
    }

    updateFilters = (filters) => {

        let activeFilters = {};
        const filterInfo = this.filter.fields;
        let hasValue, filter, info;

        for(const key in filters) {
            hasValue = false;
            filter = filters[key];
            info = filterInfo[key];
            if(info.type === "minmax") {
                if(filter[0] !== info.min || filter[1] !== info.max)
                    hasValue = true;
            }
            else if(info.type === "list" || info.type === "single") {
                if(filter.length > 0)
                    hasValue = true;
            }

            if(hasValue)
                activeFilters[key] = filter;
        }

        this.filter.current = activeFilters;

        this.applyFilters();
    }

    applyFilters = () => {

        const movies = this.movies;
        const currentFilters = this.filter.current;
        const length = movies.length;
        let i, movie, filterName, shouldShow, info, filter, movieProp, numVal;

        for(i = 0; i < length; i++) {
            movie = movies[i];
            shouldShow = true;
            for(filterName in currentFilters) {
                if(!currentFilters.hasOwnProperty(filterName)) continue;
                if(!movie.hasOwnProperty(filterName)) { shouldShow = false; break; };

                filter = currentFilters[filterName];
                movieProp = movie[filterName];
                info = this.filter.fields[filterName];

                if(info.type === "list") {
                    shouldShow = filter.every(val => movieProp.includes(val.value));
                }
                else if(info.type === "minmax") {
                    numVal = Number(movieProp.replace(/([^\d.])/g, ""));
                    shouldShow = (numVal >= filter[0] && numVal <= filter[1]);
                }
                else if(info.type === "single") {
                    shouldShow = filter.every(val => movieProp === val.value);
                }

                if(!shouldShow)
                    break;
            }
            movie.shown = shouldShow;
        }
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
        if(Array.isArray(opt)) {
            if(opt.length === 0) return;
            opt = opt[0];
        }

        if(opt.value !== this.sort.value) {
            this.sort.value = opt.value;
            this.sort.dir = opt.sortDir;

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