import { writable, type Writable, get, } from 'svelte/store';
import { asyncReadable, asyncWritable } from '@square/svelte-store';
import { callPaginatedAPI } from '$lib/api';

const CACHE_EXPIRE_MINUTES = 15;

export const planets = asyncReadable(
    {},
    async () => {       
        if (localStorage.planetsCache) {
            const json = JSON.parse(localStorage.planetsCache)
            const diff = Math.abs(Date.now()-new Date(json.createdTime).getTime());

            if(diff/60000 < CACHE_EXPIRE_MINUTES) {
                return json.planets;
            }
        }

        const { 
            error, cumulatedResponseJSON 
        } = await callPaginatedAPI<APIPlanet>('get', 'planets');

        if (error || !cumulatedResponseJSON)
            throw new Error('Unsuccessfull load of planets.')

        const planetDictionary: Record<string, Planet> = {};
        for (const planet of cumulatedResponseJSON) {
            planetDictionary[planet.url] = {
                name: planet.name, 
                diameter: planet.diameter,
                climate: planet.climate,
                population: planet.population
            }
        }

        localStorage.setItem('planetsCache', JSON.stringify({
            createdTime: new Date(),
            planets: planetDictionary
        }));

        return planetDictionary;
    },
    true
);

const createPeople = () => {
    let allPeople: Array<Person> = [];
    let lastSortedKey: keyof Person|null = null;
    const { subscribe, set, update, ...rest } = asyncWritable(
        [planets], 
        async ([$planets]) => {
            if (localStorage.peopleCache) {
                const json = JSON.parse(localStorage.peopleCache)
                const diff = Math.abs(Date.now()-new Date(json.createdTime).getTime());
                
                if(diff/60000 < CACHE_EXPIRE_MINUTES) {
                    const people: Array<Person> = [];
    
                    for (const person of json.people) {
                        people.push(
                            {
                                name: person.name,
                                height: parseFloat(person.height) || '?',
                                mass: parseFloat(person.mass) || '?',
                                created: new Date(person.created),
                                edited: new Date(person.edited),
                                homeworld: person.homeworld,
                                planetName: person.planetName,
                                visible: person.visible
                            }
                        )
                    }
    
                    allPeople = people;

                    return people;
                }
            }
    
            const { 
                error, cumulatedResponseJSON 
            } = await callPaginatedAPI<APIPerson>('get', 'people');
    
            if (error || !cumulatedResponseJSON)
                throw new Error('Unsuccessfull load of people.')
    
            const people: Array<Person> = [];
            for (const person of cumulatedResponseJSON) {
                people.push(
                    {
                        name: person.name,
                        height: parseFloat(person.height) || '?',
                        mass: parseFloat(person.mass.replace(',', '')) || '?',
                        created: new Date(person.created),
                        edited: new Date(person.edited),
                        planetName: ($planets[person.homeworld].name !== 'unknown') ? $planets[person.homeworld].name : '?',
                        homeworld: person.homeworld,
                        visible: true
                    }
                )
            }
            
            allPeople = people;    

            localStorage.setItem('peopleCache', JSON.stringify({
                createdTime: new Date(),
                people
            }));
    
            return people; 
        }
    );

    const sort = (key: keyof Person) => {
        update(state => {
            const sortDirection = lastSortedKey == key ? -1 : 1;

            state.sort((p1, p2) => {
                const keyVal1 = p1[key], keyVal2 = p2[key];
                if (keyVal1 !== '?' && keyVal2 === '?')
                    return -1;
                else if (keyVal1 === '?' && keyVal2 !== '?')
                    return 1;
                else if (keyVal1 > keyVal2)
                    return sortDirection * 1;
                else if (keyVal1 < keyVal2)
                    return sortDirection * -1;
                return 0;
            });

            lastSortedKey = key;

            if (sortDirection == -1)
                lastSortedKey = null;

            return state;
        });
    };

    const findPeopleByName = (searchName: string) => {
        setTimeout(() => {
            if (searchName.length === 0) {
                set(allPeople);

                return; 
            }
    
            set(allPeople.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase())));
        }, 250);
    };

    return {
        subscribe,
        sort,
        findPeopleByName,
        ...rest
    }
};

const createPlanetModal = () => {
    const {
			subscribe,
			set
		}: Writable<{
			visible: boolean;
			data?: { 
                name: string,
                diameter: string,
                climate: string,
                population: string
            }
		}> = writable({
			visible: false
	});

    const hide = () => {
        document.body.classList.remove('overflow-hidden');
        
        set({
            visible: false
        });
    };

    const show = (planetURL: string) => {
        const planet = get(planets)[planetURL];
        if (!planet) 
            return;

        document.body.classList.add('overflow-hidden');
        
        set({
            visible: true,
            data: {
                name: planet.name,
                diameter: planet.diameter,
                climate: planet.climate,
                population: planet.population
            }
        });
    };

    return {
        subscribe,
        hide,
        show
    }
};

export const people = createPeople();
export const planetModal = createPlanetModal();