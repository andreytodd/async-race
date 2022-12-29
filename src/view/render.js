import {getCarsPromise, updateCar, createCar, getWinners, getCarPromise} from '../store/serverAPI.js'
import { CarBlock } from './components/Garage/CarBlock.js';
import { WinnersCarBlock } from './components/Winners/WinnersCarBlock.js';
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

export async function renderWinners(page, sort, order) {
	winsTable.innerHTML = ''
	getWinners(page, sort, order)
		.then(winners => winners.forEach(winner => {
			let winnerDiv = document.createElement('div')
			winnerDiv.classList.add('winners-table__car')
			let winnerCar = getCarPromise(winner.id)
			winnerCar
				.then(info => {
					render(WinnersCarBlock(winner.id, info.name, info.color), winnerDiv)
				})
			winsTable.append(winnerDiv)
		}))
}

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




