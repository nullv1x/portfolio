// 20 Generar un arreglo con 20 números aleatorios enteros entre 1 y 100 y calcular el máximo y mínimo.

function ejercicio20() {
    // Juan Manuel Colorado Duque --> Creo un arreglo vacío
    let numeros = [];

    // Juan Manuel Colorado Duque --> Hago un ciclo y lleno el arreglo con 20 números aleatorios entre 1 y 100
    for (let i = 0; i < 20; i++) {
        numeros.push(Math.floor(Math.random() * 100) + 1); // Juan Manuel Colorado Duque --> usamos .push para agregar elementos al arreglo y Math.floor(Math.random() * 100) + 1 para generar números aleatorios entre 1 y 100
    }

    // Juan Manuel Colorado Duque --> Uso Math.max y Math.min con el operador spread que basicamente convierte el arreglo en una lista de argumentos separados por comas (Me toco ver la documentacion para entenderlo)
    let maximo = Math.max(...numeros);
    let minimo = Math.min(...numeros);

    // Juan Manuel Colorado Duque --> Muestro el resultado en la consola
    console.log("=== Ejercicio 20 ===");
    console.log("Números: " + numeros);
    console.log("Número máximo: " + maximo);
    console.log("Número mínimo: " + minimo);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado20").innerText = 
        "Números: " + numeros + 
        "\nMáximo: " + maximo + "\nMínimo: " + minimo;
}
