document.addEventListener('DOMContentLoaded', function() {
    const selectedCountry = JSON.parse(localStorage.getItem('selectedCountry'));
    if (selectedCountry) {
        displayCountryDetails(selectedCountry);
    } else {
        console.error('No country data found.');
    }
});

function displayCountryDetails(country) {
    const countryNameElement = document.getElementById('country-name');
    const countryDetailsElement = document.getElementById('country-details');

    countryNameElement.textContent = country.name.common;
    countryDetailsElement.innerHTML = `
        <p><strong>Región:</strong> ${country.region}</p>
        <p><strong>Subregión:</strong> ${country.subregion}</p>
        <p><strong>Población:</strong> ${country.population}</p>
        <p><strong>Área:</strong> ${country.area} km²</p>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Idiomas:</strong> ${Object.values(country.languages).join(', ')}</p>
        <canvas id="populationChart" width="400" height="200"></canvas>
    `;
    drawPopulationChart([country]);
}

function drawPopulationChart(countries) {
    const data = countries.map(country => ({
        name: country.name.common,
        population: country.population
    }));

    const ctx = document.getElementById('populationChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(country => country.name),
            datasets: [{
                label: 'Población',
                data: data.map(country => country.population),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
