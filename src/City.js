export class City {
    constructor(nombre, dimension, country = "") {
        this.nombre = nombre;       // nombre de la ciudad
        this.dimension = dimension; // población
        this.country = country;     // país
    }

    getNombre() { return this.nombre; }
    getDimension() { return this.dimension; }
    getCountry() { return this.country; }

    static copy(ciudad) {
        return new City(ciudad.nombre, ciudad.dimension, ciudad.country);
    }
}
