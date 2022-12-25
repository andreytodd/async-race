const Form = document.createElement('div')
Form.classList.add('cars-form')
Form.innerHTML = `
    <div class="cars-form create-car">
        <div class="create-car__input">
            <input id="name-create" type="text">
            <input id="color-create" type="color">
        </div>
        <button id="create-btn">Create</button>
    </div>
`

export default Form