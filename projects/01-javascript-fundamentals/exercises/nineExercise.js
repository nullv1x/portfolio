// 9 Obtener la raíz cúbica de un número (usar Math.cbrt).

function ejercicio9() {
    
    let numero = Math.random() * 100;  // Juan Manuel Colorado Duque --> Genero un número aleatorio

    let raiz = Math.cbrt(numero); // Juan Manuel Colorado Duque --> Calculo la raíz cúbica

    // Juan Manuel Colorado Duque --> Muestro también en la consola
    console.log("=== Ejercicio 9 ===");
    console.log("Número: " + numero);
    console.log("Raíz cúbica: " + raiz);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado9").innerText = 
        "Número: " + numero + "\nRaíz cúbica: " + raiz;
}