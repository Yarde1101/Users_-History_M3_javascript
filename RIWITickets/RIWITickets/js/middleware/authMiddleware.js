// Objeto que controla si un usuario puede ver una pantalla o no
const authMiddleware = {

    // Devuelve el usuario guardado en el navegador
    // propiedad: valor
    obtenerUsuarioActual: () => {
        const s = localStorage.getItem('usuarioLogueado');
        return s ? JSON.parse(s) : null;
    },

    // Revisa si el usuario puede entrar a la ruta que pidió
    verificarPermiso: (rutaDestino) => {
        const usuario = authMiddleware.obtenerUsuarioActual();

        // Sin sesión: solo puede ir a login o register
        if (!usuario) {
            if (rutaDestino !== '#login' && rutaDestino !== '#register') {
                window.location.hash = '#login';
                return false;
            }
            return true;
        }

        // Con sesión: si intenta ir a login o register, lo mandamos a su panel
        if (rutaDestino === '#login' || rutaDestino === '#register') {
            if (usuario.rolid === 1) window.location.hash = '#admin';
            if (usuario.rolid === 2) window.location.hash = '#tecnico';
            if (usuario.rolid === 3) window.location.hash = '#cliente';
            return false;
        }

        // Verificamos que la ruta coincida con el rol del usuario
        if (usuario.rolid === 1 && rutaDestino === '#admin') return true;
        if (usuario.rolid === 2 && rutaDestino === '#tecnico') return true;
        if (usuario.rolid === 3 && rutaDestino === '#cliente') return true;

        // Si no coincide, lo mandamos a su ruta correcta
        if (usuario.rolid === 1) window.location.hash = '#admin';
        if (usuario.rolid === 2) window.location.hash = '#tecnico';
        if (usuario.rolid === 3) window.location.hash = '#cliente';
        return false;
    }
};

export default authMiddleware;
