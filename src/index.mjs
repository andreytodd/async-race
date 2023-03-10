import {
    getCarsPromise,
    getCarPromise,
    createCar,
    deleteCar,
    startEngine,
    stopEngine,
    driveStart,
    getWinner,
    createWinner,
    deleteWinner,
    updateWinner,
    getWinners,
    getAllWinners
} from './store/serverAPI.js'
import { renderCars, updateAndRenderCar, createRandomCar, renderWinners, updateWinnersCount } from './view/render.js'
import  Header  from './view/components/Main/Header.js'
import Main from './view/components/Main/Main.js'
import Form from './view/components/Garage/Form.js'
import RaceButtons from './view/components/Garage/RaceButtons.js'
import PagesGarage from './view/components/Garage/PagesGarage.js'
import WinnersCount from './view/components/Winners/WinnersCount.js'
import WinnersTable from './view/components/Winners/WinnersTable.js'
import WinnersHeading from './view/components/Winners/WinnersHeading.js'
import WinnersTableDiv from './view/components/Winners/WinnersTableDiv.js'
import WinnersPagination from './view/components/Winners/WinnersPagination.js'



/*=================
Create HTML structure
=================*/

const wrapper = document.createElement('div')
wrapper.id = 'wrapper'
document.body.prepend(wrapper)

wrapper.append(Header)
wrapper.append(Main)

/* Garage Page rendering */

const garagePage = document.getElementById('garage-page')
garagePage.prepend(RaceButtons)
garagePage.prepend(Form)
garagePage.append(PagesGarage)

let pageNumberGarage = document.getElementById('page-number')
renderCars(pageNumberGarage.innerHTML)
checkNextGarage()

/* Winners Page rendering */

const winnersPage = document.getElementById('winners-page')
winnersPage.append(WinnersCount)
winnersPage.append(WinnersTableDiv)
WinnersTableDiv.append(WinnersHeading)
WinnersTableDiv.append(WinnersTable)
updateWinnersCount()
winnersPage.append(WinnersPagination)

let pageNumberWinners = document.getElementById('page-number-winners')
renderWinners()
checkNextWinners()


/*=================
Define elements
=================*/

/* General elements */

const garage = document.getElementById('garage')
const garageSwitcher = document.getElementById('garage-switcher')
const winnersSwitcher = document.getElementById('winners-switcher')
let selectedId
let raceResults = {}
let winsTable = document.getElementById('winsTable')

/* Form elements */

const raceBtn = document.querySelector('.race-btn')
const resetBtn = document.querySelector('.reset-btn')
const generateBtn = document.querySelector('.generate-btn')
const createName = document.getElementById('name-create')
const createColor = document.getElementById('color-create')
const createBtn = document.getElementById('create-btn')
const updateName = document.getElementById('name-update')
const updateColor = document.getElementById('color-update')
const updateBtn = document.getElementById('update-btn')

/* Footer buttons */

const previousBtn = document.querySelector('.previous-btn')
const nextBtn = document.querySelector('.next-btn')
const previousBtnWinners = document.querySelector('.previous-btn-winners')
const nextBtnWinners = document.querySelector('.next-btn-winners')
let order
let sortBy


/*=================
Switchers event listeners
=================*/

garageSwitcher.addEventListener('click', function() {
    garagePage.style.visibility = ''
    garagePage.style.position = ''
    winnersPage.style.visibility = 'hidden'
    winnersPage.style.position = 'absolute'
})

winnersSwitcher.addEventListener('click', function() {
    garagePage.style.visibility = 'hidden'
    garagePage.style.position = 'absolute'
    garagePage.style.top = '-1000px'
    winnersPage.style.visibility = 'visible'
    winnersPage.style.position = ''
    winnersPage.style.top = '0px'
})


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
    renderCars(pageNumberGarage.innerHTML)
    checkNextGarage()
})

updateBtn.addEventListener('click', function() {
    if (updateName.value !== '') {
        updateAndRenderCar(updateName.value, updateColor.value, selectedId)
        updateName.disabled = true
        updateName.value =''
    }
})


/* Race buttons listeners */

raceBtn.addEventListener('click', async function() {
    resetBtn.disabled = true
    raceBtn.disabled = true
    let allRacers = document.querySelectorAll('.car__racer__svg')
    let startEnginePromises = []
    raceResults = {}
    allRacers.forEach(racer => {
        startEnginePromises.push(startEngineAndAnimation(racer.id))
    })
    await Promise.all(startEnginePromises)
    let startDrivePromises = []
    allRacers.forEach(racer => {
        startDrivePromises.push(startRace(racer.id))
    })
    await Promise.all(startDrivePromises)
    announceWinner()
    resetBtn.disabled = false
    setTimeout(() => {
        renderWinners()
        updateWinnersCount()
    }, 2000)
})

resetBtn.addEventListener('click', async function() {
    let allRacers = document.querySelectorAll('.car__racer__svg')
    raceBtn.disabled = false
    allRacers.forEach(racer => {
        let singleRaceButton = document.querySelector(`.single-race-btn[data-id="${racer.id}"]`)
        singleRaceButton.disabled = false
        racer.classList.remove('animated')
        racer.classList.remove('paused')
        stopEngine(racer.id)
    })
})


generateBtn.addEventListener('click', function() {
    for (let i = 0; i < 100; i++) {
        createRandomCar()
    }
    setTimeout(() => renderCars(pageNumberGarage.innerHTML), 100)
    checkNextGarage()
})

/* Single car button listeners */

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

garage.addEventListener('click', async function(event) {
    if (event.target.classList.value === 'remove-btn') {
        let id = event.target.dataset.id
        garage.innerHTML = ''
        checkNextGarage()
        deleteCar(id)
        deleteWinner(id)
        renderCars(pageNumberGarage.innerHTML)
    }
})

garage.addEventListener('click', function(event) {
    if (event.target.classList.value === 'single-race-btn') {
        let id = event.target.dataset.id
        startEngineAndAnimation(id)
            .then(startRace(id))
    }
})

garage.addEventListener('click', function(event) {
    if (event.target.classList.value === 'single-stop-btn') {
        let id = event.target.dataset.id
        let raceButton = document.querySelector(`.single-race-btn[data-id="${id}"]`)
        raceButton.disabled = false
        let selectedCar = document.getElementById(id)
        selectedCar.classList.remove('animated')
        stopEngine(id)
    }
})



/* Footer previous and next button listeners */

nextBtn.addEventListener('click', function() {
    pageNumberGarage.innerHTML = (Number(pageNumberGarage.innerHTML) + 1)
    previousBtn.disabled = false
    garage.innerHTML = ''
    renderCars(pageNumberGarage.innerHTML)
    checkNextGarage()
})

previousBtn.addEventListener('click', function() {
    if (pageNumberGarage.innerHTML === '2') {
        pageNumberGarage.innerHTML = (Number(pageNumberGarage.innerHTML) - 1)
        garage.innerHTML = ''
        renderCars(pageNumberGarage.innerHTML)
        previousBtn.disabled = true
        checkNextGarage()
    } else {
        pageNumberGarage.innerHTML = (Number(pageNumberGarage.innerHTML) - 1)
        garage.innerHTML = ''
        renderCars(pageNumberGarage.innerHTML)
        checkNextGarage()
    }
})

/*=================
Winners page event listeners
=================*/

/* Sort table of winners */

WinnersHeading.addEventListener('click', function(event) {
    sortBy = event.target.dataset.sort
    order = event.target.dataset.order
    if (!event.target.dataset.sort) {
        return
    } else if (order === 'ASC') {
        renderWinners(1, sortBy, order)
        event.target.dataset.order = 'DESC'
    } else {
        renderWinners(1, sortBy, order)
        event.target.dataset.order = 'ASC'
    }
})

/* Footer previous and next button listeners */

nextBtnWinners.addEventListener('click', function() {
    pageNumberWinners.innerHTML = (Number(pageNumberWinners.innerHTML) + 1)
    previousBtnWinners.disabled = false
    winsTable.innerHTML = ''
    renderWinners(pageNumberWinners.innerHTML, sortBy, order)
    checkNextWinners()
})

previousBtnWinners.addEventListener('click', function() {
    if (pageNumberWinners.innerHTML === '2') {
        pageNumberWinners.innerHTML = (Number(pageNumberWinners.innerHTML) - 1)
        winsTable.innerHTML = ''
        renderWinners(pageNumberGarage.innerHTML, sortBy, order)
        previousBtnWinners.disabled = true
        checkNextWinners()
    } else {
        pageNumberWinners.innerHTML = (Number(pageNumberWinners.innerHTML) - 1)
        winsTable.innerHTML = ''
        renderWinners(pageNumberGarage.innerHTML, sortBy, order)
        checkNextWinners()
    }
})

/*=================
Functions
=================*/

/* Helper function to disable Next btn */

function checkNextGarage() {
	getCarsPromise()
		.then(data => {
			if (+pageNumberGarage.innerHTML >= Math.ceil((data.length) / 7)) {
				nextBtn.disabled = true
			} else {
                nextBtn.disabled = false
            }
		})
};

function checkNextWinners() {
	getAllWinners()
		.then(data => {
			if (+pageNumberWinners.innerHTML >= Math.ceil((data.length) / 10)) {
                console.log(Math.ceil((data.length) / 10))
				nextBtnWinners.disabled = true
			} else {
                nextBtnWinners.disabled = false
            }
		})
};



getWinners()
    .then(data => console.log(data))

/* Race functions */

async function startEngineAndAnimation(id) {
    let selectedCar = document.getElementById(id)
    let raceButton = document.querySelector(`.single-race-btn[data-id="${id}"]`)
    raceButton.disabled = true
    await startEngine(id)
        .then(data => {
            selectedCar.classList.add('animated')
            let animationTime = (data.distance / 1000 / data.velocity).toFixed(2)
            selectedCar.style.animationDuration = ((animationTime + 1) + 's')
            raceResults[id] = +animationTime
    })
}

async function startRace(id) {
    let selectedCar = document.getElementById(id)
    await driveStart(id)
            .then(response => response.json())
            .catch(err => {
                raceResults[id] = 10000
                selectedCar.classList.add('paused')
                console.log(err)
                console.log(`Number ${id} has broken down!`)
            })
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

async function announceWinner() {
    let allTimes = Object.values(raceResults)
    let bestTime = Math.min(...allTimes)
    let winnerId = +getKeyByValue(raceResults, bestTime)
    let response = await getWinner(winnerId)
    console.log(winnerId)
    if (response.ok) {
        let winnerCar = await response.json()
        let wins = winnerCar.wins + 1
        let newBestTime = bestTime < winnerCar.time? bestTime : winnerCar.time
        updateWinner(winnerId, wins, newBestTime)
    } else {
        createWinner(winnerId, 1, bestTime)
    }
}










