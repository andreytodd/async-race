import {
    getCarsPromise,
    getCarPromise,
    createCar,
    deleteCar,
    updateCar,
    startEngine,
    stopEngine,
    driveStart,
    startNDrive,
    getWinners,
    getWinner,
    createWinner,
    deleteWinner,
    updateWinner
} from './store/serverAPI.js'
import { render } from './view/render.js'
import { carImage } from '../src/assets/carImg.js'
import  Header  from './view/components/Header.js'
import Main from './view/components/Main.js'
import Form from './view/components/Form.js'

/* Create HTML Structure */

const wrapper = document.createElement('div')
wrapper.id = 'wrapper'
document.body.prepend(wrapper)

wrapper.append(Header)
wrapper.append(Main)
Main.prepend(Form)
renderCars()

const garage = document.getElementById('garage')
const nameCreate = document.getElementById('name-create')
const colorCreate = document.getElementById('color-create')
const createBtn = document.getElementById('create-btn')







/* Rendering garage content */

function renderCars() {
    getCarsPromise()
    .then(cars => cars.forEach(car => {
        let carDiv = document.createElement('div')
        render(carImage(car.name, car.color), carDiv)
        garage.append(carDiv)
    }))
};




document.addEventListener('click', function(event) {
    if (event.target.classList == 'carSVG') {
        render(carImage('blue'), event.target.closest('div'))
    }
})

createBtn.addEventListener('click', function() {
    garage.innerHTML = ''
    createCar(nameCreate.value, colorCreate.value)
    nameCreate.value = ''
    renderCars()
})







// getCarsPromise(1)
//     .then (cars => {
//         cars.forEach(car => startNDrive(car.id))
// })
















