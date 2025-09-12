// 13 Simular el lanzamiento de una moneda (cara o sello). 

function ejercicio13() {

    let moneda = Math.random() < 0.5 ? "Cara" : "Sello"; // Juan Manuel Colorado Duque --> Uso Math.random() para generar un número aleatorio entre 0 y 1, si el número es menor a 0.5 será "Cara", de lo contrario será "Sello"

    // Juan Manuel Colorado Duque --> Muestro el proceso en la consola
    console.log("=== Ejercicio 13 ===");
    console.log("Resultado de la moneda: " + moneda);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado13").innerText = 
        "La moneda cayó en: " + moneda;  
}
