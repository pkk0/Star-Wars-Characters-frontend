declare interface APIPlanet {
    name: string, 
    diameter: string,
    rotation_period: string,
    orbital_period: string,
    gravity: string,
    population: string,
    climate: string,
    terrain: string,
    surface_water: string,
    residents: Array<string>,
    films: Array<string>,
    url: string,
    created: string ,
    edited: string
}

declare interface Planet {
    name: string, 
    diameter: string,
    climate: string,
    population: string
}

declare interface APIPerson {
    name: string,
    eye_color: string,
    gender: string,
    hair_color: string,
    height: string ,
    mass: string,
    skin_color: string,
    homeworld: string,
    films: Array<string>,
    species: Array<string> ,
    starships: Array<string>,
    vehicles: Array<string>,
    url: string,
    created: string,
    edited: string,
}

declare interface Person {
	name: string,
	height: number | string,
	mass: number | string,
	created: Date,
	edited: Date,
	planetName: string
	homeworld: string,
	visible: boolean
}

declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}