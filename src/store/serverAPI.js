const garageURL = 'http://127.0.0.1:3000/garage';
const engineUrl = 'http://127.0.0.1:3000/engine';
const winnersUrl = 'http://127.0.0.1:3000/winners';

export async function getCarsPromise(page = null) {
    if (page === null) {
        const response = await fetch(garageURL);
        const allCars = await response.json();
        return allCars;
    } else {
        const response = await fetch(`${garageURL}?_page=${page}&_limit=7`);
        const allCars = await response.json();
        return allCars;
    }
}

export async function getWinners(sort, page = null, order = 'ASC') {
    if (page === null) {
        const response = await fetch(winnersUrl);
        const allWinners = await response.json();
        return allWinners;
    } else {
        const response = await fetch(`${winnersUrl}?_page=${page}&_limit=10&_sort=${sort}&_order=${order}`);
        const winners = await response.json();
        return winners;
    }
}

export async function getAllWinners() {
    const response = await fetch(winnersUrl);
    const allWinners = await response.json();

    return allWinners;
}

 export async function getCarPromise(id) {
    const response = await fetch(`${garageURL}/${id}`);
    const car = await response.json();

    return car;
}

 export async function createCar(name, color) {
    fetch(garageURL, {
        method: 'POST',
        body: JSON.stringify({
            name,
            color,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

 export async function deleteCar(id) {
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({
        id,
    }),
});
}

 export async function updateCar(id, name, color) {
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            color,
        }),
    });
}

export function startEngine(id) {
    return fetch(`${engineUrl}?id=${id}&status=started`, {
            method: 'PATCH',
    })
    .then((response) => response.json());
}

 export async function stopEngine(id) {
    fetch(`${engineUrl}?id=${id}&status=stopped`, {
        method: 'PATCH',
    });
}

export async function driveStart(id) {
    return fetch(`${engineUrl}?id=${id}&status=drive`, {
        method: 'PATCH',
    });
}

export async function getWinner(id) {
    return fetch(`${winnersUrl}/${id}`);
}

export async function createWinner(id, wins, time) {
    fetch(winnersUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            wins,
            time,
        }),
    });
}

export async function deleteWinner(id) {
    fetch(`${winnersUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
        }),
    });
}

export async function updateWinner(id, wins, time) {
    fetch(`${winnersUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            wins,
            time,
        }),
    });
}
