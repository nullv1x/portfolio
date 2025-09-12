//1 Redondear un número a 2 decimales usando Math.round. Ejemplo: 3.14159 → 3.14.

function ejercicio1() {

    let numero = Math.random() * 10; // Juan Manuel Colorado Duque --> Primero uso Math.random() para generar un número aleatorio entre 0 y 1 y lo multiplico por 10 para que el rango sea de 0 a 10
    
    let redondeado = Math.round(numero * 100) / 100; // Juan Manuel Colorado Duque --> Multiplico el número por 100, Uso Math.round() para redondear al entero más cercano y Luego lo divido entre 100 para dejarlo con 2 decimales

    // Juan Manuel Colorado Duque --> Muestro el proceso en la consola
    console.log("=== Ejercicio 1 ===");
    console.log("Número aleatorio generado (0 a 10): " + numero);
    console.log("Número redondeado a 2 decimales: " + redondeado);
    console.log("===================");

    document.getElementById("resultado1").innerText = numero + " ==> " + redondeado; // Juan Manuel Colorado Duque --> Selecciono el elemento con id "resultado1" y Muestro en la card el número original y su versión redondeada
}
