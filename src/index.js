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
    getAllWinners,
} from './store/serverAPI.js';
import {
    renderCars,
    updateAndRenderCar,
    createRandomCar,
    renderWinners,
    updateWinnersCount,
    updateGarageCount,
} from './view/render.js';
import Header from './view/components/Main/Header.js';
import Main from './view/components/Main/Main.js';
import Form from './view/components/Garage/Form.js';
import RaceButtons from './view/components/Garage/RaceButtons.js';
import PagesGarage from './view/components/Garage/PagesGarage.js';
import GarageCount from './view/components/Garage/GarageCount.js';
import WinnersCount from './view/components/Winners/WinnersCount.js';
import WinnersTable from './view/components/Winners/WinnersTable.js';
import WinnersHeading from './view/components/Winners/WinnersHeading.js';
import WinnersTableDiv from './view/components/Winners/WinnersTableDiv.js';
import WinnersPagination from './view/components/Winners/WinnersPagination.js';

/* Create HTML structure */

const wrapper = document.createElement('div');
wrapper.id = 'wrapper';
document.body.prepend(wrapper);

wrapper.append(Header);
wrapper.append(Main);

/* Garage Page rendering */

const garagePage = document.getElementById('garage-page');
garagePage.prepend(GarageCount);
updateGarageCount();
garagePage.prepend(RaceButtons);
garagePage.prepend(Form);
garagePage.append(PagesGarage);

const pageNumberGarage = document.getElementById('page-number');
renderCars(pageNumberGarage.innerHTML);
checkNextGarage();

/* Winners Page rendering */

const winnersPage = document.getElementById('winners-page');
winnersPage.append(WinnersCount);
winnersPage.append(WinnersTableDiv);
WinnersTableDiv.append(WinnersHeading);
WinnersTableDiv.append(WinnersTable);
updateWinnersCount();
winnersPage.append(WinnersPagination);

const pageNumberWinners = document.getElementById('page-number-winners');
renderWinners(1);
checkNextWinners();

/* Define elements */

/* General elements */

const garage = document.getElementById('garage');
const garageSwitcher = document.getElementById('garage-switcher');
const winnersSwitcher = document.getElementById('winners-switcher');
let selectedId;
let raceResults = {};
const winsTable = document.getElementById('winsTable');

/* Form elements */

const raceBtn = document.querySelector('.race-btn');
const resetBtn = document.querySelector('.reset-btn');
const generateBtn = document.querySelector('.generate-btn');
const createName = document.getElementById('name-create');
const createColor = document.getElementById('color-create');
const createBtn = document.getElementById('create-btn');
const updateName = document.getElementById('name-update');
const updateColor = document.getElementById('color-update');
const updateBtn = document.getElementById('update-btn');

/* Footer buttons */

const previousBtn = document.querySelector('.pagination__previous-btn');
const nextBtn = document.querySelector('.pagination__next-btn');
const previousBtnWinners = document.querySelector('.previous-btn-winners');
const nextBtnWinners = document.querySelector('.next-btn-winners');
let order;
let sortBy;

/* Switchers event listeners */

garageSwitcher.addEventListener('click', () => {
    garagePage.style.visibility = '';
    garagePage.style.position = '';
    winnersPage.style.visibility = 'hidden';
    winnersPage.style.position = 'absolute';
});

winnersSwitcher.addEventListener('click', () => {
    garagePage.style.visibility = 'hidden';
    garagePage.style.position = 'absolute';
    garagePage.style.top = '-1000px';
    winnersPage.style.visibility = 'visible';
    winnersPage.style.position = '';
    winnersPage.style.top = '0px';
});

/* Functions */

/* Helper function to disable Next btn */

function checkNextGarage() {
    getCarsPromise()
        .then((data) => {
            if (+pageNumberGarage.innerHTML >= Math.ceil((data.length) / 7)) {
                nextBtn.disabled = true;
            } else {
                nextBtn.disabled = false;
            }
    });
}

function checkNextWinners() {
    getAllWinners()
    .then((data) => {
        if (+pageNumberWinners.innerHTML >= Math.ceil((data.length) / 10)) {
            nextBtnWinners.disabled = true;
        } else {
            nextBtnWinners.disabled = false;
            }
    });
}

    /* Race functions */

async function startEngineAndAnimation(id) {
    const selectedCar = document.getElementById(id);
    const raceButton = document.querySelector(`.single-race-btn[data-id="${id}"]`);
    raceButton.disabled = true;
    await startEngine(id)
        .then((data) => {
            selectedCar.classList.add('animated');
            const animationTime = (data.distance / 1000 / data.velocity).toFixed(2);
            selectedCar.style.animationDuration = (`${animationTime + 1}s`);
            raceResults[id] = +animationTime;
    });
}

async function startRace(id) {
    const selectedCar = document.getElementById(id);
    await driveStart(id)
        .then((response) => response.json())
        .catch((err) => {
            raceResults[id] = 10000;
            selectedCar.classList.add('paused');
            console.log(err);
            console.log(`Number ${id} has broken down!`);
        });
}

function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

async function announceWinner() {
    const allTimes = Object.values(raceResults);
    const bestTime = Math.min(...allTimes);
    const winnerId = +getKeyByValue(raceResults, bestTime);
    const response = await getWinner(winnerId);
    if (response.ok) {
        const winnerCar = await response.json();
        const wins = winnerCar.wins + 1;
        const newBestTime = bestTime < winnerCar.time ? bestTime : winnerCar.time;
        updateWinner(winnerId, wins, newBestTime);
    } else {
        createWinner(winnerId, 1, bestTime);
    }
}

/* Garage page event listeners */

/* Form create and update button listeners */

createBtn.addEventListener('click', () => {
    garage.innerHTML = '';
    if (createName.value === '') {
        createRandomCar();
    } else {
        createCar(createName.value, createColor.value);
    }
    createName.value = '';
    renderCars(pageNumberGarage.innerHTML);
    checkNextGarage();
    updateGarageCount();
});

updateBtn.addEventListener('click', () => {
    if (updateName.value !== '') {
        updateAndRenderCar(updateName.value, updateColor.value, selectedId);
        updateName.disabled = true;
        updateBtn.disabled = true;
        updateName.value = '';
        renderWinners(1);
    }
});

/* Race buttons listeners */

raceBtn.addEventListener('click', async () => {
    resetBtn.disabled = true;
    raceBtn.disabled = true;
    const allRacers = document.querySelectorAll('.car__racer__svg');
    const startEnginePromises = [];
    raceResults = {};
    allRacers.forEach((racer) => {
        startEnginePromises.push(startEngineAndAnimation(racer.id));
    });
    await Promise.all(startEnginePromises);
    const startDrivePromises = [];
    allRacers.forEach((racer) => {
        startDrivePromises.push(startRace(racer.id));
    });
    await Promise.all(startDrivePromises);
    announceWinner();
    resetBtn.disabled = false;
    setTimeout(() => {
        renderWinners(1, sortBy, order);
        updateWinnersCount();
        checkNextWinners();
    }, 2000);
});

resetBtn.addEventListener('click', async () => {
    const allRacers = document.querySelectorAll('.car__racer__svg');
    raceBtn.disabled = false;
    allRacers.forEach((racer) => {
        const singleRaceButton = document.querySelector(`.single-race-btn[data-id="${racer.id}"]`);
        singleRaceButton.disabled = false;
        racer.classList.remove('animated');
        racer.classList.remove('paused');
        stopEngine(racer.id);
    });
});

generateBtn.addEventListener('click', () => {
    for (let i = 0; i < 100; i++) {
        createRandomCar();
    }
    setTimeout(() => renderCars(pageNumberGarage.innerHTML), 100);
    checkNextGarage();
});

/* Single car button listeners */

garage.addEventListener('click', (event) => {
    if (event.target.classList.value === 'select-btn') {
        updateBtn.disabled = false;
        getCarPromise(event.target.dataset.id)
            .then((data) => {
                updateName.value = data.name;
                updateName.disabled = false;
                updateColor.value = data.color;
                selectedId = data.id;
            });
    }
});

garage.addEventListener('click', async (event) => {
    if (event.target.classList.value === 'remove-btn') {
        const { id } = event.target.dataset;
        garage.innerHTML = '';
        deleteCar(id);
        deleteWinner(id);
        updateGarageCount();
        renderCars(pageNumberGarage.innerHTML);
        renderWinners(1, sortBy, order);
        pageNumberWinners.innerHTML = '1';
        updateWinnersCount();
        checkNextGarage();
        checkNextWinners();
    }
});

garage.addEventListener('click', (event) => {
    if (event.target.classList.value === 'single-race-btn') {
        const { id } = event.target.dataset;
        startEngineAndAnimation(id)
            .then(startRace(id));
    }
});

garage.addEventListener('click', (event) => {
    if (event.target.classList.value === 'single-stop-btn') {
        const { id } = event.target.dataset;
        const raceButton = document.querySelector(`.single-race-btn[data-id="${id}"]`);
        raceButton.disabled = false;
        const selectedCar = document.getElementById(id);
        selectedCar.classList.remove('animated');
        stopEngine(id);
    }
});

/* Previous and next button listeners */

nextBtn.addEventListener('click', () => {
    pageNumberGarage.innerHTML = (Number(pageNumberGarage.innerHTML) + 1);
    previousBtn.disabled = false;
    garage.innerHTML = '';
    renderCars(pageNumberGarage.innerHTML);
    checkNextGarage();
});

previousBtn.addEventListener('click', () => {
    if (pageNumberGarage.innerHTML === '2') {
        pageNumberGarage.innerHTML = (Number(pageNumberGarage.innerHTML) - 1);
        garage.innerHTML = '';
        renderCars(pageNumberGarage.innerHTML);
        previousBtn.disabled = true;
        checkNextGarage();
    } else {
        pageNumberGarage.innerHTML = (Number(pageNumberGarage.innerHTML) - 1);
        garage.innerHTML = '';
        renderCars(pageNumberGarage.innerHTML);
        checkNextGarage();
    }
});

/* Winners page event listeners */

/* Sort table of winners */

WinnersHeading.addEventListener('click', (event) => {
    sortBy = event.target.dataset.sort;
    order = event.target.dataset.order;
    if (!event.target.dataset.sort) {
        return;
    } else if (order === 'ASC') {
        renderWinners(1, sortBy, order);
        event.target.dataset.order = 'DESC';
    } else {
        renderWinners(1, sortBy, order);
        event.target.dataset.order = 'ASC';
    }
});

/* Previous and next button listeners */

nextBtnWinners.addEventListener('click', () => {
    pageNumberWinners.innerHTML = (Number(pageNumberWinners.innerHTML) + 1);
    previousBtnWinners.disabled = false;
    winsTable.innerHTML = '';
    renderWinners(pageNumberWinners.innerHTML, sortBy, order);
    checkNextWinners();
});

previousBtnWinners.addEventListener('click', () => {
    if (pageNumberWinners.innerHTML === '2') {
        pageNumberWinners.innerHTML = (Number(pageNumberWinners.innerHTML) - 1);
        winsTable.innerHTML = '';
        previousBtnWinners.disabled = true;
        checkNextWinners();
        renderWinners(pageNumberWinners.innerHTML, sortBy, order);
    } else {
        pageNumberWinners.innerHTML = (Number(pageNumberWinners.innerHTML) - 1);
        winsTable.innerHTML = '';
        renderWinners(pageNumberWinners.innerHTML, sortBy, order);
        checkNextWinners();
    }
});
