const PagesGarage = document.createElement('div');
PagesGarage.classList.add('garage-page__pagination');
PagesGarage.innerHTML = `
    <button class="pagination__previous-btn" disabled="true">Prev</button>
    <p class="pagination__page-number" id="page-number">1</p>
    <button class="pagination__next-btn">Next</button>
`;

export default PagesGarage;
