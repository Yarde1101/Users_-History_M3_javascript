let nombre = prompt("Cual es su nombre", "Nombre");
let Apellido = prompt("Cual es su apellido","Apellido");
let edad = prompt("Cual es su edad","Cuantos años tienes");

// 1. Necesitas un IF inicial para que el ELSE funcione
if (nombre === "" || Apellido === "" || edad === "") {
    alert("Por favor, completa todos los campos.");


} else {
    
    
    // Convertimos edad a Número
    
    edad = Number(edad);

    // Condiciones
    if (edad < 18) {
        // Para usar variables dentro de un texto, usamos comillas invertidas (``) y ${variable}
        alert(`Hola ${nombre} ${Apellido}, ¡Felicidades! Aún eres menor de edad, sigue disfrutando la vida.`);
        console.log(`Hola ${nombre} ${Apellido}, Eres menor de edad.`);
    } else {
        alert(`Hola ${nombre} ${Apellido}, Eres mayor de edad. ¡ preparate para grandes oportunidades en el mundo de la programacion.`);
        console.log(`Hola ${nombre} ${Apellido}, Eres mayor de edad.`);
    }
}