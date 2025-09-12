//12 Simular el lanzamiento de un dado de 6 caras. 

function ejercicio12() {
 
    let dado = Math.floor(Math.random() * 6) + 1; // Juan Manuel Colorado Duque --> Uso Math.random() para generar un número aleatorio entre 0 y 1, multiplico por 6 para obtener valores entre 0 y 5, uso Math.floor() para redondear hacia abajo, sumo 1 para que el rango final sea entre 1 y 6
  
    // Juan Manuel Colorado Duque --> Muestro el proceso en la consola
    console.log("=== Ejercicio 12 ===");
    console.log("Número dado: " + dado);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado12").innerText = 
        "Número dado: " + dado;
}
