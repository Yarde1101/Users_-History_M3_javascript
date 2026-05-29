// --- 1. SELECCIÓN DE ELEMENTOS DEL HTML ---
// Aquí guardamos los elementos de la página en variables para poder usarlos con JS
const inputTarea = document.getElementById("inputTarea"); // El cuadro de texto donde el usuario escribe
const btnAgregar = document.getElementById("btnAgregar"); // El botón para añadir la tarea
const listaTareas = document.getElementById("listaTareas"); // La lista (ul/ol) donde se van a mostrar las tareas
const botonesFiltro = document.querySelectorAll("[data-filtro]"); // Los botones para filtrar (Todas, Pendientes, Completadas)

// --- 2. ESTADO DE LA APLICACIÓN (DATOS) ---
// Cargamos las tareas que ya estaban guardadas en el navegador (LocalStorage). 
// Si no hay ninguna, empezamos con un array vacío [].
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// Guardamos cuál es el filtro que el usuario tiene seleccionado (por defecto es "todas").
// Usamos sessionStorage para que se mantenga si recarga la página, pero se borre al cerrar la pestaña.
let filtroActual = sessionStorage.getItem("filtro") || "todas";

// --- 3. FUNCIONES DE UTILIDAD Y RENDERIZADO ---

// Esta función guarda la lista de tareas actualizada en el LocalStorage convirtiéndola a texto (JSON)
function guardarTareas(){
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Esta es la función principal que dibuja las tareas en la pantalla
function mostrarTareas(){
    // Limpiamos la lista en el HTML para que no se dupliquen las tareas al volver a dibujar
    listaTareas.innerHTML = "";

    // Creamos una copia de las tareas para poder filtrarlas sin borrar las originales
    let tareasFiltradas = tareas;

    // Si el filtro es "pendientes", nos quedamos solo con las que tienen 'completada' en false
    if(filtroActual === "pendientes"){
        tareasFiltradas = tareas.filter(t => !t.completada);
    }

    // Si el filtro es "completadas", nos quedamos solo con las que tienen 'completada' en true
    if(filtroActual === "completadas"){
        tareasFiltradas = tareas.filter(t => t.completada);
    }

    // Recorremos las tareas que pasaron el filtro para crearlas en el HTML
    tareasFiltradas.forEach((tarea, index) => {
        // Creamos la etiqueta <li> en memoria
        const li = document.createElement("li");

       

        // Metemos el texto de la tarea y los botones de acción dentro del <li>
        // Pasamos el 'index' (la posición) a las funciones para saber a qué tarea nos referimos
        li.innerHTML = `
            <span>${tarea.texto}</span>
            <div>
                <button onclick="completarTarea(${index})">✔</button>
                <button onclick="eliminarTarea(${index})">❌</button>
            </div>
        `;

        // Metemos el <li> que acabamos de armar dentro de la lista principal del HTML
        listaTareas.appendChild(li);
    });
}

// --- 4. EVENTOS Y LÓGICA DE INTERACCIÓN ---

// Escuchamos el click del botón "Agregar"
btnAgregar.addEventListener("click", () => {
    // Le quitamos los espacios en blanco vacíos que el usuario deje al inicio o al final
    const texto = inputTarea.value.trim();

    // Si el input está vacío, salimos de la función y no hacemos nada
    if(texto === ""){
        return;
    }

    // Creamos el objeto de la nueva tarea (por defecto empieza sin completar)
    const nuevaTarea = {
        texto: texto,
        completada: false
    };

    // Metemos la nueva tarea al array general
    tareas.push(nuevaTarea);

    // Guardamos los cambios en LocalStorage y volvemos a dibujar la lista
    guardarTareas();
    mostrarTareas();

    // Limpiamos el cuadro de texto para que quede listo para otra tarea
    inputTarea.value = "";
});

// Función para marcar como completada o desmarcar una tarea
function completarTarea(index){
    // Cambiamos el estado al contrario de lo que tenga (si es true pasa a false, y viceversa)
    tareas[index].completada = !tareas[index].completada;

    // Guardamos en LocalStorage y actualizamos la pantalla
    guardarTareas();
    mostrarTareas();
}

// Función para borrar una tarea de la lista
function eliminarTarea(index){
    // Usamos splice para sacar 1 elemento del array en la posición 'index'
    tareas.splice(index, 1);

    // Guardamos la lista sin esa tarea y actualizamos la pantalla
    guardarTareas();
    mostrarTareas();
}

// Configuramos los botones de filtro (Todas, Pendientes, Completadas)
botonesFiltro.forEach(boton => {
    // A cada botón le ponemos un evento click
    boton.addEventListener("click", () => {
        // Cambiamos el filtro actual por el valor del atributo 'data-filtro' del botón presionado
        filtroActual = boton.dataset.filtro;

        // Guardamos el filtro en sessionStorage para que el navegador lo recuerde
        sessionStorage.setItem("filtro", filtroActual);

        // Volvemos a dibujar las tareas reflejando el nuevo filtro
        mostrarTareas();
    });
});