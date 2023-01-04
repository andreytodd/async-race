const Form = document.createElement('div');
Form.classList.add('garage-page__cars-form');
Form.innerHTML = `
    <div class="cars-form create-car">
        <div class="create-car__input">
            <input id="name-create" type="text">
            <input id="color-create" type="color">
        </div>
        <button id="create-btn">Create</button>
    </div>
    <div class="cars-form update-car">
        <div class="update-car__input">
            <input id="name-update" type="text" disabled="true">
            <input id="color-update" type="color">
        </div>
        <button id="update-btn" disabled="true">Update</button>
    </div>
`;

export default Form;
