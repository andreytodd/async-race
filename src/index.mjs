import {
    getCarsPromise,
    getCarPromise,
    createCar,
    deleteCar,
    startEngine,
    stopEngine,
    driveStart,
    getWinners,
    getWinner,
    createWinner,
    deleteWinner,
    updateWinner
} from './store/serverAPI.js'
import { renderCars, updateAndRenderCar, createRandomCar, renderWinners } from './view/render.js'
import  Header  from './view/components/Main/Header.js'
import Main from './view/components/Main/Main.js'
import Form from './view/components/Garage/Form.js'
import RaceButtons from './view/components/Garage/RaceButtons.js'
import PagesGarage from './view/components/Garage/PagesGarage.js'
import WinnersCount from './view/components/Winners/WinnersCount.js'
import WinnersTable from './view/components/Winners/WinnersTable.js'



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

let pageNumber = document.getElementById('page-number')
renderCars(pageNumber.innerHTML)
checkNextGarage()

/* Winners Page rendering */

const winnersPage = document.getElementById('winners-page')
winnersPage.append(WinnersCount)
winnersPage.append(WinnersTable)
getWinners(1, 'time', 'ASC')
    .then(data => {
        WinnersCount.textContent = `Winners (${data.length})`
        console.log(data)
        return data
})

renderWinners()

/*=================
Define elements
=================*/

const garage = document.getElementById('garage')

/* Form elements */

const garageSwitcher = document.getElementById('garage-switcher')
const winnersSwitcher = document.getElementById('winners-switcher')
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
let raceResults = {}

/* Footer buttons */

const previousBtn = document.querySelector('.previous-btn')
const nextBtn = document.querySelector('.next-btn')

/*=================
Switchers event listeners
=================*/

garageSwitcher.addEventListener('click', function() {
    garagePage.style.visibility = ''
    garagePage.style.position = ''
    winnersPage.style.visibility = 'hidden'
})

winnersSwitcher.addEventListener('click', function() {
    garagePage.style.visibility = 'hidden'
    garagePage.style.position = 'absolute'
    winnersPage.style.visibility = 'visible'
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
    renderCars(pageNumber.innerHTML)
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
    let promiseList = []
    raceResults = {}
    allRacers.forEach(racer => {
        promiseList.push(startEngineAndAnimation(racer.id))
    })
    Promise.all(promiseList)
        .then(
            allRacers.forEach(racer => {
            startRace(racer.id)
        })
    )

    setTimeout(() => {
        announceWinner()
        resetBtn.disabled = false
    }, 10000)
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
    setTimeout(() => renderCars(pageNumber.innerHTML), 100)
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
        renderCars(pageNumber.innerHTML)
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
    pageNumber.innerHTML = (Number(pageNumber.innerHTML) + 1)
    previousBtn.disabled = false
    garage.innerHTML = ''
    renderCars(pageNumber.innerHTML)
    checkNextGarage()
})

previousBtn.addEventListener('click', function() {
    if (pageNumber.innerHTML === '2') {
        pageNumber.innerHTML = (Number(pageNumber.innerHTML) - 1)
        garage.innerHTML = ''
        renderCars(pageNumber.innerHTML)
        previousBtn.disabled = true
        checkNextGarage()
    } else {
        pageNumber.innerHTML = (Number(pageNumber.innerHTML) - 1)
        garage.innerHTML = ''
        renderCars(pageNumber.innerHTML)
        checkNextGarage()
    }
})

/*=================
Functions
=================*/

/* Helper function to disable Next btn */

function checkNextGarage() {
	getCarsPromise()
		.then(data => {
			if (+pageNumber.innerHTML >= Math.ceil((data.length) / 7)) {
				nextBtn.disabled = true
			} else {
                nextBtn.disabled = false
            }
		})
};

/* Race functions */

async function startEngineAndAnimation(id) {
    let selectedCar = document.getElementById(id)
    let raceButton = document.querySelector(`.single-race-btn[data-id="${id}"]`)
    raceButton.disabled = true
    await startEngine(id)
        .then(data => {
            selectedCar.classList.add('animated')
            let animationTime = (data.distance / 1000 / data.velocity).toFixed(2) + 's'
            selectedCar.style.animationDuration = (animationTime)
            raceResults[id] = +animationTime.slice(0, -1)
    })
}

async function startRace(id) {
    let selectedCar = document.getElementById(id)
    driveStart(id)
            .then(response => response.json())
            .catch(err => {
                raceResults[id] = 10000
                selectedCar.classList.add('paused')
                console.log(err)
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










