import httpClient from './httpClient.js';

// Objeto con funciones relacionadas al usuario (login y logout)
const authService = {

    // Busca el usuario por correo y verifica la contraseña
    login: async (correo, contrasena) => {
        try {
            // Pedimos los usuarios que tengan ese correo
            const response = await httpClient.get(`/usuarios?correo=${correo}`);

            // Buscamos el que tenga también la misma contraseña con el metodo find/busca un elemento que cumpla con una condicion)
            const usuario = response.data.find(u => u.contrasena === contrasena);

            if (usuario) {
                // Guardamos el usuario en el navegador para mantener la sesión
                localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
                return true; //inicio exitoroso
            }
            return false; //correo o contra no coinciden

        } catch (error) {
            console.error('Error al iniciar sesión', error);
            return false; //errror al inciar sesion
        }
    },

    //borra la sesión y manda al login
    logout: () => {
        localStorage.removeItem('usuarioLogueado');
        window.location.hash = '#login';
    }
};

export default authService;
