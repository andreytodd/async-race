const Footer = document.createElement('div')
Footer.classList.add('pagination-btns')
Footer.innerHTML = `
    <button class="previous-btn" disabled="true">Prev</button>
    <p id="page-number">1</p>
    <button class="next-btn">Next</button>
`

export default Footer