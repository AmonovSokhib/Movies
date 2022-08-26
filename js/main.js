let elWrapper = document.querySelector('.movies_wrapper');
let elForm = document.querySelector('.form');
let elBody = document.querySelector('.modal-title');
let elAbout = document.querySelector('.modal-body');
let elResultMovies = document.querySelector('.result__movies');
let elReyting = document.querySelector('.imbd__rating');
let elYear = document.querySelector('.movies__year');
let elSearch = document.querySelector('.search__movies');
let elSellectCategories = document.querySelector('.categories__sellected');
let elSellectSort = document.querySelector('.sellect__sort');
let elBookmarkList = document.querySelector('.bookmarked__list');
let elPaginationList = document.querySelector('.pagination__list');

// Template

let elMoviesTemplede = document.querySelector('#movie__card').content;
let elBookmarkTemplede = document.querySelector('#bookmarkedTemplate').content;
let elPagination = document.querySelector('#btnTemp').content;

let moviesArray = movies.slice(0, 3000);
let boomarkArray = [];
let perPages = 100;
let currentPage = 1;
let pages;
let newMoviesArray = moviesArray.map(function (item) {
	return {
		img: `https://i.ytimg.com/vi/${item.ytid}/mqdefault.jpg`,
		title: item.Title.toString(),
		moviesYear: item.movie_year,
		moviesAbove: item.summary,
		moviesRaiting: item.imdb_rating,
		moviesId: item.imdb_id,
		moviesCategories: item.Categories.split('|'),
		vidioUrl: `https://www.youtube.com/watch?v=${item.ytid}`,
	};
});

function renderMovies(array) {
	elWrapper.innerHTML = null;

	let elFragment = document.createDocumentFragment();
	for (const item of array) {
		let moviesCard = elMoviesTemplede.cloneNode(true);
		moviesCard.querySelector('.card-img-top').src = item.img;
		moviesCard.querySelector('.card__heading').textContent = item.title;
		moviesCard.querySelector('.movie__year').textContent = item.moviesYear;
		moviesCard.querySelector('.movies_rating').textContent = item.moviesRaiting;
		moviesCard.querySelector('.movies__info').dataset.moviesId = item.moviesId;
		moviesCard.querySelector('.bookmark_btn').dataset.bookmarkId =
			item.moviesId;
		moviesCard.querySelector(
			'.movies__categories',
		).textContent = `Categories : ${item.moviesCategories.join(' ')}`;
		moviesCard.querySelector('.movie__link').href = item.vidioUrl;
		moviesCard.querySelector('.movie__link').setAttribute('target', 'blank');

		elFragment.appendChild(moviesCard);
	}

	elWrapper.appendChild(elFragment);
}
renderMovies(newMoviesArray.slice(0, perPages));

function generaitCategories(array) {
	let categoriesArray = [];
	for (let item of array) {
		for (let item2 of item.moviesCategories) {
			if (!categoriesArray.includes(item2)) {
				categoriesArray.push(item2);
			}
		}
	}

	return categoriesArray;
}
let generaitList = generaitCategories(newMoviesArray);

function renderCategories(array, wrapper) {
	let elFragment = document.createDocumentFragment();
	for (const item of array) {
		let newLi = document.createElement('option');
		newLi.textContent = item;
		newLi.value = item;
		elFragment.appendChild(newLi);
	}
	wrapper.appendChild(elFragment);
}
renderCategories(generaitList.sort(), elSellectCategories);
let filterArray = newMoviesArray;
elForm.addEventListener('submit', function (evt) {
	evt.preventDefault();
	let inputValSearch = elSearch.value.trim();
	let pattern = new RegExp(inputValSearch, 'gi');

	let inputValCategories = elYear.value.trim();
	let inputValRayting = elReyting.value.trim();
	let inputValCellect = elSellectCategories.value.trim();
	let inputValSort = elSellectSort.value.trim();
	filterArray = newMoviesArray.filter(function (item) {
		let sellect =
			inputValCellect == 'All'
				? true
				: item.moviesCategories.includes(inputValCellect);
		let valedetion =
			item.moviesRaiting >= inputValRayting &&
			item.moviesYear >= inputValCategories &&
			sellect &&
			item.title.match(pattern);

		return valedetion;
	});
	if (inputValSort == 'none') {
		renderMovies(newMoviesArray);
	} else {
		filterArray.sort((a, b) => {
			if (inputValSort == 'rating-high_to_low') {
				return b.moviesRaiting - a.moviesRaiting;
			}
			if (inputValSort == 'rating-low_to_high') {
				return a.moviesRaiting - b.moviesRaiting;
			}
			if (inputValSort == 'year-high_to_low') {
				return b.moviesYear - a.moviesYearr;
			}
			if (inputValSort == 'year-low_to_high') {
				return a.moviesYear - b.moviesYear;
			}
			if (inputValSort == 'a-z') {
				if (a.title > b.title) {
					return 1;
				} else if (a.title < b.title) {
					return -1;
				} else {
					return 0;
				}
			}
			if (inputValSort == 'z-a') {
				if (a.title > b.title) {
					return -1;
				} else if (a.title < b.title) {
					return 1;
				} else {
					return 0;
				}
			}
		});
	}

	renderMovies(filterArray.slice(0, perPages));
	renderBtns(filterArray);
	elResultMovies.textContent = filterArray.length;
});

elWrapper.addEventListener('click', function (evt) {
	currentVal = evt.target.dataset.bookmarkId;
	idVal = evt.target.dataset.moviesId;

	newMoviesArray.forEach((item) => {
		let current = item;
		if (idVal == current.moviesId) {
			elBody.textContent = current.title;
			elAbout.textContent = current.moviesAbove;
		}
	});

	if (currentVal) {
		let foundmovie = newMoviesArray.find((item) => {
			return currentVal == item.moviesId;
		});
		if (boomarkArray.length == 0) {
			boomarkArray.unshift(foundmovie);
		} else {
			let check = false;
			for (const item of boomarkArray) {
				if (item.moviesId == currentVal) {
					check = true;
				}
			}
			if (!check) {
				boomarkArray.unshift(foundmovie);
			}
		}
	}
	renderBookmarks(boomarkArray, elBookmarkList);
});

function renderBookmarks(array, wrapper) {
	wrapper.innerHTML = null;
	let fragment = document.createDocumentFragment();
	for (const item of array) {
		let newCard = elBookmarkTemplede.cloneNode(true);
		newCard.querySelector('.bookmark__title').textContent = item.title;
		newCard.querySelector('.bookmark__btn').dataset.bookmarkBtnId =
			item.moviesId;
		fragment.appendChild(newCard);
	}
	wrapper.append(fragment);
}
elBookmarkList.addEventListener('click', function (evt) {
	let currentBtn = evt.target.dataset.bookmarkBtnId;
	if (currentBtn) {
		let indexOfItem = boomarkArray.findIndex(function (item) {
			return item.moviesId == currentBtn;
		});
		boomarkArray.splice(indexOfItem, 1);
		renderBookmarks(boomarkArray, elBookmarkList);
	}
});

function renderBtns(array) {
	elPaginationList.innerHTML = null;
	pages = Math.ceil(array.length / perPages);
	let fragment = document.createDocumentFragment();
	for (let i = 1; i <= pages; i++) {
		let newLi = elPagination.cloneNode(true);
		newLi.querySelector('.btn__title').textContent = i;
		fragment.appendChild(newLi);
	}
	elPaginationList.appendChild(fragment);
}
renderBtns(newMoviesArray);
elPaginationList.addEventListener('click', function (evt) {
	let BtnPage = evt.target.closest('.btn__title');
	if (BtnPage) {
		let slicedArray = newMoviesArray.slice(
			(BtnPage.textContent - 1) * perPages,
			perPages * BtnPage.textContent,
		);

		renderMovies(slicedArray);
		window.scrollTo(0, 0);
	}
});
