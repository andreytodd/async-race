import { carImage } from "../../../assets/carImage.js"

export function WinnersCarBlock(id, name, color) {
    return `
        <p>My ID: ${id}</p>
        <p>My Name: ${name}</p>
        <div>${carImage(color, id, '70')}</div>
    `
}