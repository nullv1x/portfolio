// 19 Determinar si un número es potencia de 2 usando Math.log2. 

function ejercicio19() {
    // Juan Manuel Colorado Duque --> Genero un número aleatorio entre 1 y 100
    let numero = Math.floor(Math.random() * 100) + 1;

    // Juan Manuel Colorado Duque --> Uso Math.log2() y verifico si es entero
    let potenciaDos = Number.isInteger(Math.log2(numero)); // Juan Manuel Colorado Duque --> Devuelve true si es potencia de 2, false en caso contrario

    // Juan Manuel Colorado Duque --> Muestro el resultado por la consola 
    console.log("=== Ejercicio 19 ===");
    console.log("Número generado: " + numero);
    console.log("Potencia de 2: " + potenciaDos);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado19").innerText = 
        "Número: " + numero + "\nPotencia de 2: " + (potenciaDos ? "Si" : "No"); // Juan Manuel Colorado Duque --> Acabajo muestro "Si" o "No" en lugar de true o false, la parte de (potenciaDos ? "Si" : "No") basicamente es un if abreviado que cambia los valores true y false por "Si" y "No" para mayor claridad
}
