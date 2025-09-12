// Calcular el área de un triángulo dados su base 4 y altura 3, y redondear el  resultado a 2 decimales. 

function ejercicio17() {
    // Juan Manuel Colorado Duque --> Defino la base y la altura del triángulo de una vez como el enunciado indica
    let base = 4;
    let altura = 3;

    // Juan Manuel Colorado Duque --> Calculo el área usando la fórmula: (base * altura) / 2
    let area = (base * altura) / 2;

    // Juan Manuel Colorado Duque --> Redondeo el resultado a 2 decimales con toFixed(2)
    let areaRedondeada = area.toFixed(2);

    // Juan Manuel Colorado Duque --> Muestro el resultado en la consola
    console.log("=== Ejercicio 17 ===");
    console.log("Base: " + base + ", Altura: " + altura);
    console.log("Área sin redondear: " + area);
    console.log("Área redondeada a 2 decimales: " + areaRedondeada);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado17").innerText = 
        "Base: " + base + "\nAltura: " + altura + 
        "\nArea: " + areaRedondeada + " cm2";
}
