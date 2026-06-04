import authService from '../services/authService.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Pantalla de inicio de sesión
const loginView = {

    // Dibuja el formulario de login
    render: () => `
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card mt-5">
                    <div class="card-body">
                        <h3 class="text-center mb-4">Iniciar Sesión</h3>
                        <input type="email" id="correo" class="form-control mb-3" placeholder="Correo">
                        <input type="password" id="pass" class="form-control mb-3" placeholder="Contraseña">
                        <button id="btn-login" class="btn btn-primary w-100 mb-3">Entrar</button>
                        <p id="mensaje-error" class="text-danger mt-2 text-center" style="display:none;">Datos incorrectos</p>
                        <div class="text-center">
                            <a href="#register" class="text-decoration-none">¿No tienes cuenta? Regístrate aquí</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,

    // Activa el botón de login
    iniciarEventos: () => {
        document.getElementById('btn-login').addEventListener('click', async () => {
            const correo = document.getElementById('correo').value;
            const pass = document.getElementById('pass').value;
            const exito = await authService.login(correo, pass);

            if (exito) {
                // Redirigimos según el rol
                const user = authMiddleware.obtenerUsuarioActual();
                if (user.rolid === 1) window.location.hash = '#admin';
                if (user.rolid === 2) window.location.hash = '#tecnico';
                if (user.rolid === 3) window.location.hash = '#cliente';
            } else {
                // Mostramos error si los datos no coinciden
                document.getElementById('mensaje-error').style.display = 'block';
            }
        });
    }
};

export default loginView;
