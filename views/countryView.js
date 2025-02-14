document.addEventListener('DOMContentLoaded', function () {
    const countryCode = localStorage.getItem('selectedCountryCode');

    if (countryCode) {
        fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
            .then(response => response.json())
            .then(data => {
                const country = new CountryModel(data[0]);
                displayCountryDetails(country);
            })
            .catch(error => console.error('Error fetching country details:', error));
    } else {
        console.error('No country code found.');
    }
});

function displayCountryDetails(country) {
    const countryNameElement = document.getElementById('country-name');
    const countryFlagElement = document.getElementById('country-flag');
    const countryInfoElement = document.getElementById('country-info');
    const countryMap = L.map('country-map').setView(country.latlng || [0, 0], 5);

    countryNameElement.textContent = country.name;

    countryNameElement.textContent = country.name;
    countryFlagElement.src = country.flag;
    countryFlagElement.alt = `Bandera de ${country.name}`;

    // Muestra toda la información del país
    countryInfoElement.innerHTML = `
        <p><strong>Capital:</strong> ${country.capital && Array.isArray(country.capital) ? country.capital.join(', ') : 'N/A'}</p>
        <p><strong>Región:</strong> ${country.region}</p>
        <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Área:</strong> ${country.area.toLocaleString()} km²</p>
        <p><strong>Idiomas:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
        <p><strong>Monedas:</strong> ${country.currencies ? Object.keys(country.currencies).join(', ') : 'N/A'}</p>
    `;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(countryMap);

    L.marker(country.latlng || [0, 0]).addTo(countryMap)
        .bindPopup(country.name.common);
}