import {getCarsPromise, updateCar, createCar} from '../store/serverAPI.js'
import { CarBlock } from './components/CarBlock.js';
import { randomColor, randomCar } from '../store/carData.js';

export function render (template, node) {
	if (!node) return;
	node.innerHTML = (typeof template === 'function' ? template() : template);
};

export function renderCars(page) {
    getCarsPromise(page)
    .then(cars => cars.forEach(car => {
        let carDiv = document.createElement('div')
		carDiv.id = `id_${car.id}`
        carDiv.classList.add('garage__car')
        render(CarBlock(car.name, car.color, car.id), carDiv)
        garage.append(carDiv)
    }))
};

export function updateAndRenderCar(name, color, id) {
    let selectedCar = document.getElementById(`id_${id}`)
    updateCar(id, name, color)
	render(CarBlock(name, color, id), selectedCar)
};

export function createRandomCar() {
	createCar(
		randomCar(),
		randomColor()
)}




