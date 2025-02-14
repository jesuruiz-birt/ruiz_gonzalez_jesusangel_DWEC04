document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const countryList = document.getElementById('country-list');
    const filterContinent = document.getElementById('filter-continent');
    const filterRegion = document.getElementById('filter-region');
    const filterLanguage = document.getElementById('filter-language');
    const filterCurrency = document.getElementById('filter-currency');

    searchButton.addEventListener('click', function () {
        filterCountries();
    });

    searchBar.addEventListener('keyup', function () {
        filterCountries();
    });

    filterContinent.addEventListener('change', function () {
        updateRegions();
        filterCountries();
    });

    filterRegion.addEventListener('change', function () {
        filterCountries();
    });

    filterLanguage.addEventListener('change', function () {
        filterCountries();
    });

    filterCurrency.addEventListener('change', function () {
        filterCountries();
    });

    function filterCountries() {
        const query = searchBar.value.toLowerCase();
        const continent = filterContinent.value;
        const region = filterRegion.value;
        const language = filterLanguage.value;
        const currency = filterCurrency.value;
        const countryItems = countryList.querySelectorAll('.country-item');

        const filteredCountries = Array.from(countryItems)
            .filter(item => {
                const countryName = item.querySelector('h2').textContent.toLowerCase();
                const countryRegion = item.dataset.region;
                const countryContinent = item.dataset.continent;
                const countryLanguages = item.dataset.languages.split(',');
                const countryCurrencies = item.dataset.currencies.split(',');

                const matchesQuery = countryName.includes(query);
                const matchesContinent = continent === '' || countryContinent === continent;
                const matchesRegion = region === '' || countryRegion === region;
                const matchesLanguage = language === '' || countryLanguages.includes(language);
                const matchesCurrency = currency === '' || countryCurrencies.includes(currency);

                return matchesQuery && matchesContinent && matchesRegion && matchesLanguage && matchesCurrency;
            })
            .map(item => {
                const countryCode = item.dataset.countryCode;
                return countries.find(country => country.cca3 === countryCode);
            });

        updateMapMarkers(filteredCountries);

        countryItems.forEach(item => {
            const countryName = item.querySelector('h2').textContent.toLowerCase();
            const countryRegion = item.dataset.region;
            const countryContinent = item.dataset.continent;
            const countryLanguages = item.dataset.languages.split(',');
            const countryCurrencies = item.dataset.currencies.split(',');

            const matchesQuery = countryName.includes(query);
            const matchesContinent = continent === '' || countryContinent === continent;
            const matchesRegion = region === '' || countryRegion === region;
            const matchesLanguage = language === '' || countryLanguages.includes(language);
            const matchesCurrency = currency === '' || countryCurrencies.includes(currency);

            if (matchesQuery && matchesContinent && matchesRegion && matchesLanguage && matchesCurrency) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function updateRegions() {
        const selectedContinent = filterContinent.value;
        const countryItems = countryList.querySelectorAll('.country-item');
        const regions = new Set();

        countryItems.forEach(item => {
            if (item.dataset.continent === selectedContinent || selectedContinent === '') {
                regions.add(item.dataset.region);
            }
        });

        filterRegion.innerHTML = '<option value="">Selecciona una región</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            filterRegion.appendChild(option);
        });
    }
});
