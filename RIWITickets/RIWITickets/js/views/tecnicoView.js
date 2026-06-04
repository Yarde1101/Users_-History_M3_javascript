import axios from 'axios';
import authService from '../services/authService.js';
import authMiddleware from '../middleware/authMiddleware.js';
import ticketService from '../services/ticketService.js';

// URL de tickets desde el .env
const TICKETS_API = import.meta.env.VITE_TICKETS_API;

// Panel del técnico
const tecnicoView = {

    // Dibuja el HTML del panel
    render: () => `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Panel de Técnico</h2>
            <button id="btn-salir-tecnico" class="btn btn-danger">Cerrar Sesión</button>
        </div>

        <!-- Formulario para crear un ticket rápido -->
        <div class="card mb-4">
            <div class="card-body">
                <h4>Crear Ticket Rápido</h4>
                <input type="text" id="nombre-tec" class="form-control mb-2" placeholder="Título">
                <select id="tipo-tec" class="form-control mb-2">
                    <option value="incidente">Incidente</option>
                    <option value="requerimiento">Requerimiento</option>
                    <option value="soporte">Soporte</option>
                </select>
                <textarea id="desc-tec" class="form-control mb-2" placeholder="Descripción"></textarea>
                <button id="btn-crear-tec" class="btn btn-success">Crear y Asignarme</button>
            </div>
        </div>

        <!-- Lista de tareas asignadas al técnico -->
        <div class="card">
            <div class="card-body">
                <h4>Mis Tareas Asignadas</h4>
                <div id="lista-tareas-tec" class="list-group mt-2"></div>
            </div>
        </div>

        <!-- Modal para ver el detalle del ticket y cambiar estado -->
        <div class="modal fade" id="modalTicketTec" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal-tec-titulo"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Tipo:</strong> <span id="modal-tec-tipo"></span></p>
                        <p><strong>Cliente:</strong> <span id="modal-tec-cliente"></span></p>
                        <p><strong>Descripción:</strong> <span id="modal-tec-desc"></span></p>
                        <p><strong>Estado actual:</strong> <span id="modal-tec-estado"></span></p>
                        <hr>
                        <label class="form-label"><strong>Actualizar Estado:</strong></label>
                        <select id="select-estado-tec" class="form-control mb-2">
                            <option value="Abierto">Abierto</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Cerrado">Cerrado</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" id="btn-guardar-tec">Guardar</button>
                    </div>
                </div>
            </div>
        </div>`,

    iniciarEventos: async () => {
        document.getElementById('btn-salir-tecnico').addEventListener('click', () => authService.logout());
        const usuario = authMiddleware.obtenerUsuarioActual();
        let ticketActualId = null;

        // Carga los tickets asignados a este técnico
        const cargarTareas = async () => {
            const todos = await ticketService.obtenerTodos();
            const contenedor = document.getElementById('lista-tareas-tec');
            contenedor.innerHTML = '';
            const misTareas = todos.filter(t => t.tecnicoAsignado === usuario.nombre);

            if (misTareas.length === 0) { contenedor.innerHTML = '<p>No tienes tareas asignadas.</p>'; return; }

            misTareas.forEach(ticket => {
                const cliente = (ticket.clienteNombre && ticket.clienteNombre !== 'N/A') ? ticket.clienteNombre : 'Interno';
                const badgeColor = ticket.estado === 'Cerrado' ? 'bg-success' : ticket.estado === 'En proceso' ? 'bg-warning text-dark' : 'bg-danger';
                contenedor.innerHTML += `
                    <div class="list-group-item list-group-item-action" style="cursor:pointer" data-id="${ticket.id}">
                        <div class="d-flex justify-content-between">
                            <h6 class="mb-1">${ticket.nombre} <span class="badge bg-info text-dark">${ticket.tipo}</span></h6>
                            <span class="badge ${badgeColor}">${ticket.estado}</span>
                        </div>
                        <small>Cliente: ${cliente}</small>
                    </div>`;
            });

            // Al hacer click abrimos el modal con los detalles
            document.querySelectorAll('#lista-tareas-tec .list-group-item-action').forEach(item => {
                item.addEventListener('click', async () => {
                    const resp = await axios.get(`${TICKETS_API}/tickets/${item.dataset.id}`);
                    const t = resp.data;
                    ticketActualId = t.id;
                    document.getElementById('modal-tec-titulo').textContent = t.nombre;
                    document.getElementById('modal-tec-tipo').textContent = t.tipo;
                    document.getElementById('modal-tec-cliente').textContent = (t.clienteNombre && t.clienteNombre !== 'N/A') ? t.clienteNombre : 'Interno';
                    document.getElementById('modal-tec-desc').textContent = t.descripcion;
                    document.getElementById('modal-tec-estado').textContent = t.estado;
                    document.getElementById('select-estado-tec').value = t.estado;
                    new bootstrap.Modal(document.getElementById('modalTicketTec')).show();
                });
            });
        };

        // Guarda el nuevo estado del ticket
        document.getElementById('btn-guardar-tec').addEventListener('click', async () => {
            if (!ticketActualId) return;
            await axios.patch(`${TICKETS_API}/tickets/${ticketActualId}`, {
                estado: document.getElementById('select-estado-tec').value
            });
            bootstrap.Modal.getInstance(document.getElementById('modalTicketTec')).hide();
            await cargarTareas();
        });

        // Crea un ticket y lo asigna al técnico logueado
        document.getElementById('btn-crear-tec').addEventListener('click', async () => {
            const nombre = document.getElementById('nombre-tec').value;
            const tipo = document.getElementById('tipo-tec').value;
            const desc = document.getElementById('desc-tec').value;
            if (!nombre || !desc) { alert('Completa título y descripción.'); return; }
            await ticketService.crear({
                nombre, tipo, descripcion: desc,
                clienteId: 'N/A', clienteNombre: 'N/A',
                tecnicoAsignado: usuario.nombre,
                estado: 'En proceso'
            });
            document.getElementById('nombre-tec').value = '';
            document.getElementById('desc-tec').value = '';
            await cargarTareas();
        });

        await cargarTareas();
    }
};

export default tecnicoView;
