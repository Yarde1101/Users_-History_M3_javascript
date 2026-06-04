import router from './router.js';
import authMiddleware from './middleware/authMiddleware.js';
import authService from './services/authService.js';

// Arranca la app cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', () => {
    router();

    // Cierra sesión automáticamente después de 5 minutos sin actividad
    let tiempoInactivo;

    const reiniciarTiempo = () => {
        clearTimeout(tiempoInactivo);
        tiempoInactivo = setTimeout(() => {
            if (authMiddleware.obtenerUsuarioActual()) {
                alert('Sesión cerrada por inactividad');
                authService.logout();
            }
        }, 300000); // 5 min
    };

    // Reinicia el contador con cualquier movimiento o tecla
    window.onload = reiniciarTiempo;
    document.onmousemove = reiniciarTiempo;
    document.onkeypress = reiniciarTiempo;
});
