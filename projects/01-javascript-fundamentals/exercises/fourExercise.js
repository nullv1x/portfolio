//4 Calcular la hipotenusa de un triángulo rectángulo dados sus catetos cateto A=4 cateto B=3 hipotenusa? (usar Math.sqrt).

function ejercicio4() {
    // Juan Manuel Colorado Duque --> Hago dos variables y defino los catetos
    let catetoA = 4; 
    let catetoB = 3; 

    let sumaCuadrados = (catetoA ** 2) + (catetoB ** 2); // Juan Manuel Colorado Duque --> Aplico el teorema de Pitágoras: a2 + b2

    let hipotenusa = Math.sqrt(sumaCuadrados); // Juan Manuel Colorado Duque --> Uso Math.sqrt() para sacar la raíz cuadrada

    // Juan Manuel Colorado Duque --> Muestro todo el proceso en consola
    console.log("=== Ejercicio 4 ===");
    console.log("Cateto A: " + catetoA);
    console.log("Cateto B: " + catetoB);
    console.log("Suma de cuadrados (a2 + b2): " + sumaCuadrados);
    console.log("Hipotenusa: " + hipotenusa);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado4").innerText = 
        `Cateto A: ${catetoA}, Cateto B: ${catetoB} 
         Hipotenusa: ${hipotenusa}`;
    // Juan Manuel Colorado Duque --> Uso ${} para insertar variables dentro de una cadena de texto
}
