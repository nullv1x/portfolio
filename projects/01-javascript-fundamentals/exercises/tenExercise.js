// 10 Generar una contraseña numérica aleatoria de 6 dígitos.

function ejercicio10() {
    
    let password = Math.floor(100000 + Math.random() * 900000); // Juan Manuel Colorado Duque --> Genero un número aleatorio entre 100000 y 999999 lo cual me permetira crear la contraseña de 6 digitos

    // Juan Manuel Colorado Duque --> Muestro el resultado en la consola
    console.log("=== Ejercicio 10 ===");
    console.log("Contraseña generada: " + password);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado10").innerText = 
        "Contraseña generada: " + password;
}
