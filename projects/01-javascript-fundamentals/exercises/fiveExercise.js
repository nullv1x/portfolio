// 5 Obtener el valor absoluto de la diferencia entre dos números.

function ejercicio5() {
    
    let num1 = Math.floor(Math.random() * 50 + 1); // Juan Manuel Colorado Duque --> Genero el primer número aleatorio entre 1 y 50

    let num2 = Math.floor(Math.random() * 50 + 1); // Juan Manuel Colorado Duque --> Genero el segundo número aleatorio entre 1 y 50

    let diferencia = num1 - num2; // Juan Manuel Colorado Duque --> Calculo la diferencia (puede ser negativa)

    let valorAbsoluto = Math.abs(diferencia); // Juan Manuel Colorado Duque --> Uso Math.abs() para obtener el valor absoluto

    console.log("=== Ejercicio 5 ===");
    // Juan Manuel Colorado Duque --> Muestro el proceso en consola
    console.log("Número 1: " + num1);
    console.log("Número 2: " + num2);
    console.log("Diferencia: " + diferencia);
    console.log("Diferencia absoluta: " + valorAbsoluto);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro todo en la card
    document.getElementById("resultado5").innerText = 
        `Números: ${num1} y ${num2} 
        Diferencia: ${valorAbsoluto}`;
}