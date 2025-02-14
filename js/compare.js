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

function drawAreaChart(countries) {
    const data = countries.map(country => ({
        name: country.name.common,
        area: country.area
    }));

    const ctx = document.getElementById('areaChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(country => country.name),
            datasets: [{
                label: 'Área (km²)',
                data: data.map(country => country.area),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
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

function initMap(countries) {
    const map = L.map('comparison-details').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    countries.forEach(country => {
        if (country.latlng) {
            L.marker(country.latlng).addTo(map)
                .bindPopup(country.name.common);
        }
    });

    if (countries.length >= 2 && countries[0].latlng && countries[1].latlng) {
        const polyline = L.polyline([countries[0].latlng, countries[1].latlng], { color: 'red' }).addTo(map);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const selectedCountries = JSON.parse(localStorage.getItem('selectedCountries'));

    if (selectedCountries && selectedCountries.length > 0) {
        drawPopulationChart(selectedCountries);
        drawAreaChart(selectedCountries);
        initMap(selectedCountries);
    } else {
        console.error('No countries selected for comparison.');
        alert('No countries selected for comparison.');
        window.location.href = 'index.html';
    }
});
