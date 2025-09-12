// 15 Redondear un número decimal al múltiplo de 10 más cercano. 

function ejercicio15() {
    // Juan Manuel Colorado Duque --> Genero un número aleatorio entre 0 y 500
    let numero = Math.random() * 500;

    // Juan Manuel Colorado Duque --> Divido el número entre 10, redondeo al entero más cercano y multiplico por 10
    let redondeado = Math.round(numero / 10) * 10;

    // Juan Manuel Colorado Duque --> Muestro el resultado en la consola
    console.log("=== Ejercicio 15 ===");
    console.log("Número generado: " + numero);
    console.log("Número redondeado al múltiplo de 10 más cercano: " + redondeado);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el número original y el redondeado en la card
    document.getElementById("resultado15").innerText = 
        "Número: " + numero.toFixed(2) + "\nRedondeado al múltiplo de 10: " + redondeado;
}
