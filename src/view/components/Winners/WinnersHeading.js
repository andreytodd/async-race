let WinnersHeading = document.createElement('div')
WinnersHeading.classList.add('winners__heading')
WinnersHeading.innerHTML = `
    <p>Car</p>
    <p>Name</p>
    <p data-sort="id" data-order="ASC">ID</p>
    <p data-sort="wins" data-order="ASC">Wins</p>
    <p data-sort="time" data-order="ASC">Best time</p>
`

export default WinnersHeading;