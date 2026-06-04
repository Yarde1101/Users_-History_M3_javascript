import httpClient from '../services/httpClient.js';

// Pantalla de registro para nuevos clientes
const registerView = {

    // Dibuja el formulario de registro
    render: () => `
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card mt-5 shadow-sm">
                    <div class="card-body">
                        <h3 class="text-center mb-4 text-primary">Crear una Cuenta</h3>
                        <input type="text" id="reg-nombre" class="form-control mb-3" placeholder="Tu Nombre completo">
                        <input type="email" id="reg-correo" class="form-control mb-3" placeholder="Tu Correo electrónico">
                        <input type="password" id="reg-pass" class="form-control mb-3" placeholder="Crea una Contraseña">
                        <button id="btn-registrar" class="btn btn-primary w-100 mb-3">Registrarme</button>
                        <div class="text-center">
                            <a href="#login" class="text-decoration-none">¿Ya tienes cuenta? Inicia sesión aquí</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,

    // Activa el botón de registrarse
    iniciarEventos: () => {
        document.getElementById('btn-registrar').addEventListener('click', async () => {
            const nombre = document.getElementById('reg-nombre').value;
            const correo = document.getElementById('reg-correo').value;
            const contrasena = document.getElementById('reg-pass').value;

            // Validamos que todos los campos estén llenos
            if (!nombre || !correo || !contrasena) {
                alert('Por favor, llena todos los campos.');
                return;
            }

            try {
                // Enviamos el nuevo usuario con rol 3 (cliente) por defecto
                await httpClient.post('/usuarios', {
                    nombre, correo, contrasena,
                    rolid: 3,
                    creado: new Date().toLocaleDateString()
                });
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                window.location.hash = '#login';
            } catch (error) {
                console.error('Error al registrar', error);
                alert('Hubo un problema al registrarte.');
            }
        });
    }
};

export default registerView;
