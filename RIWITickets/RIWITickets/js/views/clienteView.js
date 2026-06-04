import axios from 'axios';
import authService from '../services/authService.js';
import authMiddleware from '../middleware/authMiddleware.js';
import ticketService from '../services/ticketService.js';

// URL de tickets desde el .env
const TICKETS_API = import.meta.env.VITE_TICKETS_API;

// Panel del cliente
const clienteView = {

    // Dibuja el HTML del panel
    render: () => `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Mi Panel de Cliente</h2>
            <button id="btn-salir-cliente" class="btn btn-danger">Cerrar Sesión</button>
        </div>

        <!-- Formulario para reportar un problema -->
        <div class="card mb-4">
            <div class="card-body">
                <h4>Reportar un nuevo problema</h4>
                <input type="text" id="nombre-ticket" class="form-control mb-2" placeholder="Título del problema">
                <select id="tipo-ticket" class="form-control mb-2">
                    <option value="incidente">Incidente</option>
                    <option value="requerimiento">Requerimiento</option>
                    <option value="soporte">Soporte</option>
                </select>
                <textarea id="desc-ticket" class="form-control mb-2" placeholder="Describe tu problema aquí..."></textarea>
                <button id="btn-crear" class="btn btn-success">Crear Ticket</button>
            </div>
        </div>

        <!-- Lista de tickets del cliente -->
        <h4>Mis Tickets</h4>
        <div id="lista-mis-tickets" class="list-group"><p>Cargando tus tickets...</p></div>

        <!-- Modal de solo lectura para ver el detalle -->
        <div class="modal fade" id="modalDetalleCliente" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="mc-titulo"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Tipo:</strong> <span id="mc-tipo"></span></p>
                        <p><strong>Descripción:</strong> <span id="mc-desc"></span></p>
                        <p><strong>Estado:</strong> <span id="mc-estado"></span></p>
                        <p><strong>Técnico asignado:</strong> <span id="mc-tecnico"></span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>`,

    iniciarEventos: async () => {
        document.getElementById('btn-salir-cliente').addEventListener('click', () => authService.logout());
        const usuario = authMiddleware.obtenerUsuarioActual();

        // Carga y muestra solo los tickets del cliente logueado
        const cargarMisTickets = async () => {
            const todos = await ticketService.obtenerTodos();
            const contenedor = document.getElementById('lista-mis-tickets');
            contenedor.innerHTML = '';
            const misTickets = todos.filter(t => t.clienteId == usuario.id);

            if (misTickets.length === 0) { contenedor.innerHTML = '<p>Aún no has creado ningún ticket.</p>'; return; }

            misTickets.forEach(ticket => {
                const tecnico = ticket.tecnicoAsignado || 'Esperando técnico...';
                const badgeColor = ticket.estado === 'Cerrado' ? 'bg-success' : ticket.estado === 'En proceso' ? 'bg-warning text-dark' : 'bg-danger';
                contenedor.innerHTML += `
                    <div class="list-group-item list-group-item-action" style="cursor:pointer" data-id="${ticket.id}">
                        <div class="d-flex justify-content-between">
                            <h6 class="mb-1">${ticket.nombre} <span class="badge bg-info text-dark">${ticket.tipo}</span></h6>
                            <span class="badge ${badgeColor}">${ticket.estado}</span>
                        </div>
                        <small>${tecnico}</small>
                    </div>`;
            });

            // Al hacer click abre el modal en modo solo lectura
            document.querySelectorAll('#lista-mis-tickets .list-group-item-action').forEach(item => {
                item.addEventListener('click', async () => {
                    const resp = await axios.get(`${TICKETS_API}/tickets/${item.dataset.id}`);
                    const t = resp.data;
                    document.getElementById('mc-titulo').textContent = t.nombre;
                    document.getElementById('mc-tipo').textContent = t.tipo;
                    document.getElementById('mc-desc').textContent = t.descripcion;
                    document.getElementById('mc-estado').textContent = t.estado;
                    document.getElementById('mc-tecnico').textContent = t.tecnicoAsignado || 'Sin asignar';
                    new bootstrap.Modal(document.getElementById('modalDetalleCliente')).show();
                });
            });
        };

        await cargarMisTickets();

        // Crea un ticket nuevo con los datos del cliente logueado
        document.getElementById('btn-crear').addEventListener('click', async () => {
            const nombre = document.getElementById('nombre-ticket').value;
            const tipo = document.getElementById('tipo-ticket').value;
            const desc = document.getElementById('desc-ticket').value;
            if (!nombre || !desc) { alert('Completa título y descripción.'); return; }
            await ticketService.crear({
                nombre, tipo, descripcion: desc,
                clienteId: usuario.id,
                clienteNombre: usuario.nombre,
                tecnicoAsignado: null,
                estado: 'Abierto'
            });
            alert('¡Ticket creado!');
            document.getElementById('nombre-ticket').value = '';
            document.getElementById('desc-ticket').value = '';
            await cargarMisTickets();
        });
    }
};

export default clienteView;
