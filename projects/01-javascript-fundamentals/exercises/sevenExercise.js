// 7 Redondear siempre hacia abajo el número de páginas cuando se imprime un documento (usar Math.floor).

function ejercicio7() {

    let paginas = Math.random() * 50; // Juan Manuel Colorado Duque --> Genero un numero de paginas aleatorio entre 1 y 50
    
    let redondeado = Math.floor(paginas); // Juan Manuel Colorado Duque --> Uso Math.floor() para redondear hacia abajo y obtener solo las páginas completas sin decimales

    // Juan Manuel Colorado Duque --> Muestro el proceso en la consola
    console.log("=== Ejercicio 7 ===");
    console.log("Paginas: " + paginas);
    console.log("Paginas redondeadas: " + redondeado);
    console.log("===================");

    // Juan Manuel Colorado Duque --> Muestro el resultado en la card
    document.getElementById("resultado7").innerText = 
        "Total de páginas impresas: " + redondeado; 
}