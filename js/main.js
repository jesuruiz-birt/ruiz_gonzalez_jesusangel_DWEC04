let selectedCountries = [];
let map;
let countries;

$(document).ready(function () {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            countries = data;
            displayCountries(data);
            populateRegionFilter(data);
            populateLanguageFilter(data);
            populateCurrencyFilter(data);
            initMap(data);
        })
        .catch(error => {
            console.error('Error fetching or processing countries:', error);
            $('#country-list').html('<p>Error loading countries. Please try again later.</p>');
            $('#map').html('<p>Error loading map. Please try again later.</p>');
        });

    const compareButton = $('#compare-button');

    compareButton.on('click', () => {
        if (selectedCountries.length > 1) {
            localStorage.setItem('selectedCountries', JSON.stringify(selectedCountries));
            window.location.href = 'compare.html';
        } else {
            alert('Por favor, selecciona al menos dos países para comparar.');
        }
    });
});

function displayCountries(countries) {
    const countryList = $('#country-list');
    countryList.empty();

    countries.sort((a, b) => b.population - a.population);

    countries.forEach((country, index) => {
        const countryItem = document.createElement('div');
        countryItem.className = 'country-item';
        countryItem.dataset.continent = country.region;
        countryItem.dataset.region = country.subregion || 'N/A';
        countryItem.dataset.countryCode = country.cca3;
        countryItem.dataset.languages = country.languages ? Object.values(country.languages).join(',') : '';
        countryItem.dataset.currencies = country.currencies ? Object.keys(country.currencies).join(',') : '';

        countryItem.innerHTML = `
            <span class="ranking">${index + 1}</span>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
            <h2>${country.name.common}</h2>
            <div class="indicators">
                <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Área:</strong> ${country.area.toLocaleString()} km²</p>
            </div>
            <input type="checkbox" class="country-checkbox" data-country='${JSON.stringify(country)}'>
        `;

        const checkbox = countryItem.querySelector('.country-checkbox');
        checkbox.addEventListener('click', (event) => {
            event.stopPropagation();
            if (checkbox.checked) {
                selectedCountries.push(country);
            } else {
                selectedCountries = selectedCountries.filter(c => c.cca3 !== country.cca3);
            }
            console.log(selectedCountries);
        });

        countryItem.addEventListener('click', () => {
            if (!checkbox.checked) {
                localStorage.setItem('selectedCountryCode', country.cca3);
                window.location.href = 'country.html';
            }
        });

        countryList.append(countryItem);
    });
}

function populateRegionFilter(countries) {
    const filterRegion = $('#filter-region');
    const regions = new Set();

    countries.forEach(country => {
        regions.add(country.subregion || 'N/A');
    });

    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        filterRegion.append(option);
    });
}

function populateLanguageFilter(countries) {
    const filterLanguage = $('#filter-language');
    const languages = new Set();

    countries.forEach(country => {
        if (country.languages) {
            Object.values(country.languages).forEach(language => {
                languages.add(language);
            });
        }
    });

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = language;
        filterLanguage.append(option);
    });
}

function populateCurrencyFilter(countries) {
    const filterCurrency = $('#filter-currency');
    const currencies = new Set();

    countries.forEach(country => {
        if (country.currencies) {
            Object.keys(country.currencies).forEach(currency => {
                currencies.add(currency);
            });
        }
    });

    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        filterCurrency.append(option);
    });
}

function initMap(countries) {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    countries.forEach(country => {
        if (country.latlng) {
            L.marker(country.latlng).addTo(map)
                .bindPopup(country.name.common);
        }
    });
}

function updateMapMarkers(countries) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    countries.forEach(country => {
        if (country.latlng) {
            L.marker(country.latlng).addTo(map)
                .bindPopup(country.name.common);
        }
    });
}
