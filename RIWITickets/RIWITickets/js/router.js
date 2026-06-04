import authMiddleware from './middleware/authMiddleware.js';
import loginView from './views/login.js';
import registerView from './views/register.js';
import adminView from './views/adminView.js';
import tecnicoView from './views/tecnicoView.js';
import clienteView from './views/clienteView.js';

// Controla qué pantalla se muestra según el hash de la URL
const router = () => {
    // Leemos la ruta del hash, por defecto mandamos al login
    const ruta = window.location.hash || '#login';

    // El middleware verifica si el usuario tiene permiso para esta ruta
    if (!authMiddleware.verificarPermiso(ruta)) return;

    // Limpiamos el contenedor principal
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    // Mostramos la pantalla correspondiente a la ruta
    if (ruta === '#login') { appDiv.innerHTML = loginView.render(); loginView.iniciarEventos(); }
    else if (ruta === '#register') { appDiv.innerHTML = registerView.render(); registerView.iniciarEventos(); }
    else if (ruta === '#admin') { appDiv.innerHTML = adminView.render(); adminView.iniciarEventos(); }
    else if (ruta === '#tecnico') { appDiv.innerHTML = tecnicoView.render(); tecnicoView.iniciarEventos(); }
    else if (ruta === '#cliente') { appDiv.innerHTML = clienteView.render(); clienteView.iniciarEventos(); }
};

// Escucha cada vez que cambia el hash para actualizar la pantalla
window.addEventListener('hashchange', router);

export default router;
