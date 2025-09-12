// 3 Calcular el área de un círculo de 5cm de radio (usar Math.PI).

function ejercicio3() {
    
    let radio = Math.floor(Math.random() * 10) + 1; // Juan Manuel Colorado Duque --> Genero un número aleatorio entre 1 y 10 para el radio

    let area = Math.PI * Math.pow(radio, 2); // Juan Manuel Colorado Duque --> Uso Math.PI para obtener el valor de pi, elevo el radio al cuadrado con Math.pow(radio, 2), multiplico pi por el radio al cuadrado para obtener el área

    // Juan Manuel Colorado Duque --> Muestro el proceso en consola
    console.log("=== Ejercicio 3 ===");
    console.log("Radio generado: " + radio + " cm");
    console.log("Cálculo: pi * (radio2)");
    console.log("pi = " + Math.PI);
    console.log("radio2 = " + Math.pow(radio, 2));
    console.log("Área del círculo: " + area.toFixed(2) + " cm2"); // Juan Manuel Colorado Duque --> Uso toFixed(2) para mostrar el área con 2 decimales
    console.log("===================");

    // Juan Manuel Colorado Duque --> Selecciono el elemento con id "resultado3" y muestro en la card el radio usado y el área calculada
    document.getElementById("resultado3").innerText =  
        "Radio: " + radio + " cm ==> Área: " + area.toFixed(2) + " cm2";    
}
