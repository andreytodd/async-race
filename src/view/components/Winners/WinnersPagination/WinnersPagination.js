const WinnersPagination = document.createElement('div');
WinnersPagination.classList.add('winners-page__pagination');
WinnersPagination.innerHTML = `
    <button class="previous-btn-winners" disabled="true">Prev</button>
    <p id="page-number-winners">1</p>
    <button class="next-btn-winners">Next</button>
`;

export default WinnersPagination;
