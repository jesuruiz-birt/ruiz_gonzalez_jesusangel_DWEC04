class CountryModel {
    constructor(data) {
        this.name = data.name.common;
        this.flag = data.flags.png; 
        this.capital = data.capital;
        this.region = data.region;
        this.population = data.population;
        this.area = data.area;
        this.languages = data.languages;
        this.currencies = data.currencies;
        this.latlng = data.latlng;
    }
}
