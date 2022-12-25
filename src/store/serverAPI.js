const garageURL = 'http://127.0.0.1:3000/garage'
const engineUrl = 'http://127.0.0.1:3000/engine'
const winnersUrl = 'http://127.0.0.1:3000/winners'


/*===============
===============*/



export async function getCarsPromise(page = null) {
    if (page == null) {
        let response = await fetch(garageURL)
        let allCars = await response.json()
        return allCars
    } else {
        let response = await fetch(garageURL + `?_page=${page}&_limit=7`)
        let allCars = await response.json()
        return allCars
    }



}

/*===============
===============*/

 export async function getCarPromise(id) {
    let response = await fetch(garageURL + `/${id}`)
    let car = await response.json()

    return car
}

/*===============
===============*/

 export async function createCar(name, color) {
    fetch(garageURL, {
        method: 'POST',
        body: JSON.stringify({
            name,
            color
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/*===============
===============*/

 export async function deleteCar(id) {
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({
        id,
    })
})
}

/*===============
===============*/

 export async function updateCar(id, name, color) {
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            color
        })
    })
}

/*===============
===============*/

export async function startEngine(id) {
    try {
        fetch(engineUrl + `?id=${id}&status=started`, {
            method: 'PATCH',
        })
            .then(response => response.json())
            .then(data => console.log(data))
    } catch(err) {
        console.log(err)
    }

}

/*===============
===============*/

 export async function stopEngine(id) {
    fetch(engineUrl + `?id=${id}&status=stopped`, {
        method: 'PATCH',
    })
}

/*===============
===============*/


export function driveStart(id) {
        fetch(engineUrl + `?id=${id}&status=drive`, {
            method: 'PATCH'
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
}

/*===============
===============*/

export async function startNDrive(id) {
    try {
        startEngine(id)
            .then(driveStart(id))
    } catch(err) {
        console.log(err)
    }
}

/*===============
===============*/

export async function getWinners() {
    fetch(winnersUrl)
        .then(response => response.json())
        .then(data => console.log(data))
}

/*===============
===============*/

export async function getWinner(id) {
    fetch(winnersUrl + `/${id}`)
        .then(response => response.json())
        .then(data => console.log(data))
}

/*===============
===============*/

export async function createWinner(id, wins, time) {
    fetch(winnersUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            wins,
            time
        })
    })
}

/*===============
===============*/

export async function deleteWinner(id) {
    fetch(winnersUrl + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
        })
    })
}

/*===============
===============*/

export async function updateWinner(id, wins, time) {
    fetch(winnersUrl + `/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wins,
            time
        })
    })
}








