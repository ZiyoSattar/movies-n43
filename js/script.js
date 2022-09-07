let favorites = [];

var normalizedMovies = movies.slice(0,100).map((movie) => {
  return {
    title: movie.Title.toString(),
    year: movie.movie_year,
    categories: movie.Categories.split('|'),
    summary: movie.summary,
    imdbId: movie.imdb_id,
    imdbRating: movie.imdb_rating,
    runtime: movie.runtime,
    language: movie.language,
    trailer: `https://youtube.com/watch?v=${movie.ytid}`,
    bigPoster: `https://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`,
    smallPoster: `https://i3.ytimg.com/vi/${movie.ytid}/hqresdefault.jpg`, 
  };
});

let elSearchForm = $(".js-search-form");
let elSearchTitleInput = $(".js-search-form__title-input", elSearchForm);
let elSearchRatingInput = $(".js-search-form__rating-input", elSearchForm);
let elSearchGanreSelect = $(".js-search-form__genre-select", elSearchForm);
let elSearchSortSelect = $(".js-search-form__sort-select", elSearchForm);

let elSearchResults = $(".search-results");

let elSearchResultTemplate = $("#search-result-template").content;

let createGenreSelectOptions = () => {
  let moviesCategories = [];

  normalizedMovies.slice(0, 700).forEach(movie => {
    movie.categories.forEach(category => {
      if (!moviesCategories.includes(category)) {
        moviesCategories.push(category);
      }
    })
  })

  moviesCategories.sort();

  let elOptionsFragment = document.createDocumentFragment();

  moviesCategories.forEach(category => {
    let elCategoryOption = createElement("option", "", category);
    elCategoryOption.value = category;

    elOptionsFragment.appendChild(elCategoryOption);
  })

  elSearchGanreSelect.appendChild(elOptionsFragment);
}

createGenreSelectOptions();

let renderResults = (searchResults) => {
  elSearchResults.innerHTML = "";

  let elResultsFragment = document.createDocumentFragment();

  searchResults.forEach(movie => {
    let elMovie = elSearchResultTemplate.cloneNode(true);

    $(".movie__poster", elMovie).src = movie.bigPoster;
    $(".movie__poster", elMovie).alt = movie.title;
    $(".movie__title", elMovie).textContent = movie.title;
    $(".movie__year", elMovie).textContent = movie.year;
    $(".movie__rating", elMovie).textContent = movie.imdbRating;
    $(".movie__trailer-link", elMovie).href = movie.trailer;

    elResultsFragment.appendChild(elMovie);
  })

  elSearchResults.appendChild(elResultsFragment);
}

renderResults(normalizedMovies.slice(0, 50));

let sortSearchResults = (results, sortType) => {
  if (sortType === "az") {
    results.forEach(result => {
      console.log(result.title);
    })
    return results.sort((a, b) => {
      if (a.title > b.title) {
        return 1;
      } else if (a.title < b.title) {
        return -1;
      } else {
        return 0;
      }
    });
  } 
  else if (sortType === "za") {
    results.forEach(result => {
      console.log(result.title);
    })
    return results.sort((a, b) => {
      if (a.title < b.title) {
        return 1;
      } else if (a.title > b.title) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if (sortType === "rating_desc") {
    results.forEach(result => {
      console.log(result.imdbRating);
    })
    return results.sort((a, b) => {
      if (a.imdbRating < b.imdbRating) {
        return 1;
      } else if (a.imdbRating > b.imdbRating) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if (sortType === "rating_asc") {
    results.forEach(result => {
      console.log(result.imdbRating);
    })
    return results.sort((a, b) => {
      if (a.imdbRating > b.imdbRating) {
        return 1;
      } else if (a.imdbRating < b.imdbRating) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if (sortType === "year_descn") {
    results.forEach(result => {
      console.log(result.year);
    })
    return results.sort((a, b) => {
      if (a.year < b.year) {
        return 1;
      } else if (a.year > b.year) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if (sortType === "year_desco") {
    results.forEach(result => {
      console.log(result.year);
    })
    return results.sort((a, b) => {
      if (a.year > b.year) {
        return 1;
      } else if (a.year < b.year) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}

let findMovies = (title, minRating, genre) => {
  return normalizedMovies.filter(movie => {
    let doesMatchCategory = genre === "All" || movie.categories.includes(genre);
    
    return movie.title.match(title) && movie.imdbRating > minRating && doesMatchCategory;
  })
}

elSearchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let searchTitle = elSearchTitleInput.value.trim();
  let movieTitleRegex = new RegExp(searchTitle, "gi");

  let minimumRating = Number(elSearchRatingInput.value);
  let genre = elSearchGanreSelect.value;
  let sorting = elSearchSortSelect.value;

  let searchResults = findMovies(movieTitleRegex, minimumRating, genre);
  sortSearchResults(searchResults, sorting);

  renderResults(searchResults);
})

