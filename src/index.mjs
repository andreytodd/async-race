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
import { render, renderCars, updateAndRenderCar, createRandomCar } from './view/render.js'
import  Header  from './view/components/Header.js'
import Main from './view/components/Main.js'
import Form from './view/components/Form.js'
import RaceButtons from './view/components/RaceButtons.js'
import Footer from './view/components/Footer.js'
import { carAnimation, driveTiming } from './view/animation/CarMovement.js'



/*=================
Create HTML structure
=================*/

const wrapper = document.createElement('div')
wrapper.id = 'wrapper'
document.body.prepend(wrapper)

wrapper.append(Header)
wrapper.append(Main)
const garagePage = document.getElementById('garage-page')
garagePage.prepend(RaceButtons)
garagePage.prepend(Form)
wrapper.append(Footer)

let pageNumber = document.getElementById('page-number')
renderCars(pageNumber.innerHTML)
checkNextBtn()

/*=================
Define elements
=================*/

let garage = document.getElementById('garage')

/* Form elements */

const form = document.querySelector('.cars-form')
const raceBtn = document.querySelector('.race-btn')
const resetBtn = document.querySelector('.reset-btn')
const generateBtn = document.querySelector('.generate-btn')
const createName = document.getElementById('name-create')
const createColor = document.getElementById('color-create')
const createBtn = document.getElementById('create-btn')
const updateName = document.getElementById('name-update')
const updateColor = document.getElementById('color-update')
const updateBtn = document.getElementById('update-btn')
let selectedId

/* Footer buttons */

const previousBtn = document.querySelector('.previous-btn')
const nextBtn = document.querySelector('.next-btn')


/*=================
Garage page event listeners
=================*/

/* Form create and update button listeners */

createBtn.addEventListener('click', function() {
    garage.innerHTML = ''
    if (createName.value === '') {
        createRandomCar()
    } else {
        createCar(createName.value, createColor.value)
    }
    createName.value = ''
    setTimeout(() => renderCars(pageNumber.innerHTML), 0)
    checkNextBtn()
})

updateBtn.addEventListener('click', function() {
    if (updateName.value !== '') {
        updateAndRenderCar(updateName.value, updateColor.value, selectedId)
        updateName.disabled = true
        updateName.value =''
    }
})


/* Race buttons listeners */

generateBtn.addEventListener('click', function() {
    for (let i = 0; i < 100; i++) {
        createRandomCar()
    }
    setTimeout(() => renderCars(pageNumber.innerHTML), 100)
    checkNextBtn()
})

/* Cars select and delete button listeners */

garage.addEventListener('click', function(event) {
    if (event.target.classList.value === 'select-btn') {
        getCarPromise(event.target.dataset.id)
            .then(data => {
                updateName.value = data.name
                updateName.disabled = false
                updateColor.value = data.color
                selectedId = data.id
            })
    }
})

garage.addEventListener('click', function(event) {
    if (event.target.classList.value === 'remove-btn') {
        garage.innerHTML = ''
        deleteCar(event.target.dataset.id)
        setTimeout(() => renderCars(pageNumber.innerHTML), 0)
        checkNextBtn()
    }
})

garage.addEventListener('click', function(event) {
    if (event.target.classList.value === 'single-race-btn') {
        let raceButton = event.target
        raceButton.disabled = true
        let id = event.target.dataset.id
        startEngineAndDrive(id)
    }
})



/* Footer previous and next button listeners */

nextBtn.addEventListener('click', function() {
    pageNumber.innerHTML = (Number(pageNumber.innerHTML) + 1)
    previousBtn.disabled = false
    garage.innerHTML = ''
    renderCars(pageNumber.innerHTML)
    checkNextBtn()
})

previousBtn.addEventListener('click', function() {
    if (pageNumber.innerHTML === '2') {
        pageNumber.innerHTML = (Number(pageNumber.innerHTML) - 1)
        garage.innerHTML = ''
        renderCars(pageNumber.innerHTML)
        previousBtn.disabled = true
        checkNextBtn()
    } else {
        pageNumber.innerHTML = (Number(pageNumber.innerHTML) - 1)
        garage.innerHTML = ''
        renderCars(pageNumber.innerHTML)
        checkNextBtn()
    }
})

/*=================
Functions
=================*/

/* Helper function to disable Next btn */

function checkNextBtn() {
	getCarsPromise()
		.then(data => {
			if (+pageNumber.innerHTML >= Math.ceil((data.length) / 7)) {
				nextBtn.disabled = true
			} else {
                nextBtn.disabled = false
            }
		})
};

/* Start And Drive function */


function startEngineAndDrive(id) {
    let selectedCar = document.getElementById(id)
        startEngine(id)
            .then(response => response.json())
            .then(data => {
                selectedCar.classList.add('animated')
                let animationTime = data.distance / 1000 / data.velocity + 's'
                selectedCar.style.animationDuration = (animationTime)
            })
            .then(driveStart(id)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(err => {
                    selectedCar.classList.add('paused')
                    console.log(err)
                })
                )
    }





