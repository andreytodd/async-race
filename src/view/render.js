import {getCarsPromise, updateCar} from '../store/serverAPI.js'
import { CarBlock } from './components/CarBlock.js';

export function render (template, node) {
	if (!node) return;
	node.innerHTML = (typeof template === 'function' ? template() : template);
};

export function renderCars(page) {
    getCarsPromise(page)
    .then(cars => cars.forEach(car => {
        let carDiv = document.createElement('div')
        carDiv.classList.add('garage__car')
        carDiv.id = car.id
        render(CarBlock(car.name, car.color, car.id), carDiv)
        garage.append(carDiv)
    }))
};

export function updateAndRenderCar(name, color, id) {
    let selectedCar = document.getElementById(id)
    updateCar(id, name, color)
    render(CarBlock(name, color, id), selectedCar)
};

// export function checkNextBtn() {
// 	getCarsPromise()
// 		.then(data => {
// 			if (+pageNumber.innerHTML === Math.ceil((data.length) / 7)) {
// 				nextBtn.disabled = true
// 			}
// 		})
// };

