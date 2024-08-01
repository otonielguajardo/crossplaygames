<script>
	let elements = {
		platformA: document.getElementById('platform_a'),
		platformB: document.getElementById('platform_b'),
		q: document.getElementById('q')
	}

	let queryParams = {
		platformA: '',
		platformB: '',
		q: ''
	}

	function clearFilter() {
		queryParams.q = "";
		queryParams.platformA = "";
		queryParams.platformB = "";
		elements.q.value = "";
		elements.platformA.value = "";
		elements.platformB.value = "";

		updateQueryString();
	}

	function applyFilter() {
		queryParams.q = elements.q.value;
		queryParams.platformA = elements.platformA.value;
		queryParams.platformB = elements.platformB.value;

		updateQueryString();
	}

	// update elements values programatically
	function selectPlatform(platform) {
		let platformToUpdate = 'platformB';
		let valueToSet = platform;

		if (queryParams.platformA === platform) {
			platformToUpdate = 'platformA';
			valueToSet = ''
		} else if (queryParams.platformB === platform) {
			platformToUpdate = 'platformB';
			valueToSet = ''
		} else if (queryParams.platformA === '') {
			platformToUpdate = 'platformA';
			valueToSet = platform;
		} else if (queryParams.platformB === '') {
			platformToUpdate = 'platformB';
			valueToSet = platform;
		}

		queryParams[platformToUpdate] = valueToSet;
		elements[platformToUpdate].value = queryParams[platformToUpdate];

		updateQueryString();
	}

	// update queryString with elements values
	function updateQueryString() {
		let url = new URL(window.location);

		for (const [key, value] of Object.entries(queryParams)) {
			url.searchParams.set(key, value);
		}

		window.history.pushState({}, '', url);

		updateUi();
	}

	// updates elements with queryString values
	function initQueryString() {
		let url = new URL(window.location);

		for (let [key, value] of url.searchParams.entries()) {
			queryParams[key] = value;
			elements[key].value = value;
		}

		updateUi();
	}

	initQueryString();

	function updateUi() {
		let queryPlatforms = [queryParams.platformA, queryParams.platformB].filter(p => p !== '');
		let gameEls = document.querySelectorAll('.game');

		gameEls.forEach(gameEl => {
			gameEl.classList.remove("d-none");

			let gamePlatforms = [];
			let platformEls = gameEl.querySelectorAll("[data-platform]");
			let gameTitle = gameEl.getElementsByClassName('card-title')[0].innerHTML;

			// color badges -------------------------------------------------------------
			platformEls.forEach(platformEl => {
				const platform = platformEl.getAttribute("data-platform");
				gamePlatforms.push(platform);

				// reset color
				platformEl.classList.add("text-bg-dark");
				platformEl.classList.add("border-dark");
				platformEl.classList.remove("text-bg-danger");
				platformEl.classList.remove("border-danger");

				// set color if platform present in query
				const isMatch = queryPlatforms.includes(platform);
				if (isMatch) {
					platformEl.classList.add("text-bg-danger");
					platformEl.classList.add("border-danger");
					platformEl.classList.remove("text-bg-dark");
					platformEl.classList.remove("border-dark");
				}
			});

			// hide game ----------------------------------------------------------------------------
			let = shouldHideGame = false;

			// if any queryPlatform set and not all of gamePlatforms are present in queryPlatforms
			if ((queryPlatforms.length > 0) && !includesAll(queryPlatforms, gamePlatforms)) {
				shouldHideGame = true;
			}

			// if queryParam q is set and name doesnt match
			if ((queryParams.q !== '') && !gameTitle.toLowerCase().includes(queryParams.q.toLowerCase())){
				shouldHideGame = true;
			}

			if (shouldHideGame) {
				gameEl.classList.add('d-none');
			}
		});
	}

	function includesAll(array1, array2) {
		let set1 = new Set(array1);
		let set2 = new Set(array2);

		let allInArray2 = array1.every(item => set2.has(item));
		let allInArray1 = array2.every(item => set1.has(item));

		return allInArray2 || allInArray1;
	}

</script>