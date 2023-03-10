import { carImage } from "../../../assets/carImage.js"

export function CarBlock(name, color, id) {
    return `
    <button class="select-btn" data-id="${id}">Select</button>
    <button class="remove-btn" data-id="${id}">Remove</button>
    <button class="single-race-btn" data-id="${id}">Start race</button>
    <button class="single-stop-btn" data-id="${id}">End race</button>
    <p>${name}</p>
    <div class="car__racer">
        ${carImage(color, id)}
    </div>
    `
}
