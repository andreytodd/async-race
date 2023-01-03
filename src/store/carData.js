const brands = ['Acura', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroen', 'Dacia', 'Dodge', 'Fiat', 'Ford', 'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lancia', 'Lexus', 'Lotus', 'Maserati', 'Mazda', 'Mercedes', 'Mini', 'Mitsubishi', 'Nissan', 'Peugeot', 'Plymouth', 'Renault', 'Rover', 'Saab', 'SEAT', 'Skoda', 'Smart', 'Tesla', 'VW', 'Toyota', 'Volvo'];

const models = ['A3', 'A4', 'A5', 'A6', 'A8', 'GSX', 'Stealth', 'CL-X', 'Flying Spur', 'Continental', 'Bentayga', 'X3', 'X5', 'X6', 'Veyron', 'Chiron', 'Divo', 'Encore GX', 'ENVISION ST', 'SRX', 'CTS', 'PT Cruiser', 'Pacifica', 'Voyager', 'C3', 'C5', 'Duster', 'Logan', 'Jogger', 'Stealth', 'Viper', 'Interpid', 'Avenger', 'Albea', 'Argenta', '500', 'Mustang', 'Puma', 'Explorer', 'City', 'Civic', 'Jazz', 'H2', 'H3', 'Creta', 'Venue', 'ESQ', 'Q30', 'V-Cross', 'Hi-Lander', 'F-Type', 'XF', 'Grand Cherokee', 'Wrangler', 'Sonet', 'Carens', 'Delta', 'Alfa', 'Appia', 'LX 450', 'Evora', 'Ghibli', 'Quattroporte', 'MX-5', 'GLS', 'Maybach', 'Cooper', 'Colt', 'Primera', '406', 'Arrow', 'Volare', 'Megane', 'Clio', 'BRM', 'Ursaab', 'Monster', 'Toledo', 'Ibiza', 'Octavia', 'Citygo', 'Superb', 'Yeti', 'Fabia', 'Fortwo', 'Model S', 'Passat', 'Touareg', 'Touran', 'Golf', 'Land Cruiser', 'Corolla', 'Hilux', 'Camry', 'XC40', 'V60'];

export function randomCar() {
    return `${brands[Math.floor(Math.random() * brands.length)]} ${models[Math.floor(Math.random() * models.length)]}`;
}

export function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
