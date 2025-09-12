// 18 Generar un número aleatorio impar entre 1 y 99. 

function ejercicio18() {
    // Juan Manuel Colorado Duque --> Genero un número aleatorio entre 1 y 99
    let numero = Math.floor(Math.random() * 99) + 1;

    // Juan Manuel Colorado Duque --> Hago una condicion que me ayude a verificar si el número es par, si lo es, le sumo 1 para que sea impar
    if (numero % 2 === 0) {
        numero++;
    }

    // Juan Manuel Colorado Duque --> Muestro también en la consola
    console.log("=== Ejercicio 18 ===");
    console.log("Número impar: " + numero);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado18").innerText = 
        "Número impar generado: " + numero;
}
