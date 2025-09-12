// 6 Redondear siempre hacia arriba el precio de un producto con decimales (usar Math.ceil).

function ejercicio6() {
    
    let precio = Math.random() * 100; // Juan Manuel Colorado Duque --> Genero un precio aleatorio entre 1 y 100 con decimales

    let precioRedondeado = Math.ceil(precio* 100) / 100; // Juan Manuel Colorado Duque --> Uso Math.ceil() para redondear SIEMPRE hacia arriba al entero más cercano

    // Juan Manuel Colorado Duque --> Muestro el proceso en la consola
    console.log("=== Ejercicio 6 ===");
    console.log("Precio : $" + precio);
    console.log("Precio redondeado: $" + precioRedondeado);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro en la card el precio original y el redondeado 
    document.getElementById("resultado6").innerText =  
        "Precio original: $" + precio.toFixed(5) + "\nPrecio redondeado: $" + precioRedondeado;
}
