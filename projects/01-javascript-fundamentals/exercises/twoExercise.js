// 2 Generar un número entero aleatorio entre 10 y 50.

function ejercicio2() {
    
    let numero;
    numero = Math.floor(Math.random() * 50 + 10); // Juan Manuel Colorado Duque --> Use Math.random() para generar un número aleatorio entre 0 y 1, lo multiplico por 50 para que ahora el rango sea de 0 a 50, le sumo 10 para que el rango sea de 10 a 60, Uso Math.floor() para redondear hacia abajo y obtener un número entero

    console.log("=== Ejercicio 2 ===");
    console.log("Número aleatorio generado entre 10 y 60: " + numero); // Juan Manuel Colorado Duque --> Muestro en la consola el número generado
    console.log("===================");

    document.getElementById("resultado2").innerText = numero; // Juan Manuel Colorado Duque --> Selecciono el elemento con id "resultado2", muestro en la card el número generado en lugar de mostrarlo en la consola
}
