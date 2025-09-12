//8 Calcular la potencia de un número (usar Math.pow).

function ejercicio8() {
    // Juan Manuel Colorado Duque --> Defino el numero de la base aleatoriamente y el exponente tambien
    let base = Math.random() * 10; 
    let exponente = Math.random() * 10;

    // Juan Manuel Colorado Duque --> Uso Math.pow(base, exponente) para calcular la potencia
    let resultado = Math.pow(base, exponente);

    // Juan Manuel Colorado Duque --> También lo muestro en la consola
    console.log("=== Ejercicio 8 ===");
    console.log("Base: " + base);
    console.log("Exponente: " + exponente);
    console.log("Resultado: " + resultado);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado8").innerText = 
        `Base: ${base}, Exponente: ${exponente} 
         Resultado: ${resultado}`;
}
