// 14 Calcular la diagonal de un rectángulo dados su base y altura (usar  Math.sqrt y potencias). 

function ejercicio14() {

    // Juan Manuel Colorado Duque --> Para hacerlo mas estatico por temas de agilidad, vamos a definir de una vez los valres de la base y la altura. Pero se puede usar un Math.random() para calcular la diagonal de valores aleatorios.
    let base = 5;  
    let altura = 12;  

    // Juan Manuel Colorado Duque --> Voy a usar Math.pow() para elevar base y altura al cuadrado
    let baseElevada = Math.pow(base, 2);
    let alturaElevada = Math.pow(altura, 2);

    // Juan Manuel Colorado Duque --> Aplico el Teorema de Pitágoras que basicamente es diagonal = raiz cuadrada de (base2 + altura2)
    let diagonal = Math.sqrt(baseElevada + alturaElevada);

    // Juan Manuel Colorado Duque --> Muestro el proceso en la consola
    console.log("=== Ejercicio 14 ===");
    console.log("Base: " + base);
    console.log("Altura: " + altura);
    console.log("Diagonal: " + diagonal);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado14").innerText = 
        "La diagonal del rectángulo es: " + diagonal;
}
