function ejercicio16() {
    // Juan Manuel Colorado Duque --> Aca genero un ángulo aleatorio en grados entre 0 y 360
    let grados = Math.random() * 360;

    // Juan Manuel Colorado Duque --> Convierto de grados a radianes usando la fórmula: radianes = grados * (Math.PI / 180)
    let radianes = grados * (Math.PI / 180);

    // Juan Manuel Colorado Duque --> Ahora convierto los radianes de vuelta a grados usando: grados = radianes * (180 / Math.PI)
    let gradosConvertidos = radianes * (180 / Math.PI);

    // Juan Manuel Colorado Duque --> También muestro en la consola
    console.log("=== Ejercicio 16 ===");
    console.log("Grados originales: " + grados);
    console.log("Convertido a radianes: " + radianes);
    console.log("De radianes a grados: " + gradosConvertidos);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro en la card los valores
    document.getElementById("resultado16").innerText = 
        "Angulo: " + grados.toFixed(2) + "°" + 
        "\nRadianes: " + radianes.toFixed(4) + 
        "\nRadianes a Grados: " + gradosConvertidos.toFixed(2) + "°";
}
