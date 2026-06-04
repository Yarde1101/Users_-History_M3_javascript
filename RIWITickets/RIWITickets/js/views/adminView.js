import axios from 'axios';
import authService from '../services/authService.js';
import authMiddleware from '../middleware/authMiddleware.js';

// URLs desde el .env
const AUTH_API = import.meta.env.VITE_AUTH_API;
const TICKETS_API = import.meta.env.VITE_TICKETS_API;

// Panel del admini
const adminView = {

    //el HTML del panel de admin
    render: () => `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Panel de Administrador</h2>
            <button id="btn-salir" class="btn btn-danger">Cerrar Sesión</button>
        </div>

        <!-- Sección de gestión de usuarios -->
        <div class="card mb-4">
            <div class="card-body">
                <h4>Gestión de Usuarios</h4>
                <div id="lista-usuarios" class="list-group mt-2"><p>Cargando...</p></div>
            </div>
        </div>

        <!-- Formulario para crear un ticket -->
        <div class="card mb-4">
            <div class="card-body">
                <h4>Crear Ticket</h4>
                <input type="text" id="nombre-ticket-admin" class="form-control mb-2" placeholder="Título">
                <select id="tipo-ticket-admin" class="form-control mb-2">
                    <option value="incidente">Incidente</option>
                    <option value="requerimiento">Requerimiento</option>
                    <option value="soporte">Soporte</option>
                </select>
                <textarea id="desc-ticket-admin" class="form-control mb-2" placeholder="Descripción..."></textarea>
                <button id="btn-crear-admin" class="btn btn-success">Crear Ticket</button>
            </div>
        </div>

        <!-- Lista de todos los tickets -->
        <div class="card">
            <div class="card-body">
                <h4>Todos los Tickets</h4>
                <div id="lista-tickets" class="list-group mt-2"><p>Cargando...</p></div>
            </div>
        </div>

        <!-- Modal para ver y editar un ticket -->
        <div class="modal fade" id="modalTicket" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal-titulo"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Tipo:</strong> <span id="modal-tipo"></span></p>
                        <p><strong>Descripción:</strong> <span id="modal-desc"></span></p>
                        <hr>
                        <label class="form-label"><strong>Cliente:</strong></label>
                        <select id="select-cliente" class="form-control mb-2"></select>
                        <label class="form-label"><strong>Técnico asignado:</strong></label>
                        <select id="select-tecnico" class="form-control mb-2"></select>
                        <label class="form-label"><strong>Estado:</strong></label>
                        <select id="select-estado" class="form-control mb-2">
                            <option value="Abierto">Abierto</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Cerrado">Cerrado</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="btn-eliminar-modal">Eliminar Ticket</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" id="btn-guardar-modal">Guardar</button>
                    </div>
                </div>
            </div>
        </div>`,

    iniciarEventos: async () => {
        document.getElementById('btn-salir').addEventListener('click', () => authService.logout());
        const usuario = authMiddleware.obtenerUsuarioActual();
        let ticketActualId = null;

        // Carga y muestra la lista de usuarios (sin el admin)
        const cargarUsuarios = async () => {
            const resp = await axios.get(`${AUTH_API}/usuarios`);
            const usuarios = resp.data.filter(u => u.rolid !== 1);
            const contenedor = document.getElementById('lista-usuarios');
            contenedor.innerHTML = '';

            if (usuarios.length === 0) { contenedor.innerHTML = '<p>No hay usuarios.</p>'; return; }

            usuarios.forEach(u => {
                const esTecnico = u.rolid === 2;
                contenedor.innerHTML += `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${u.nombre}</strong> — ${u.correo}
                            <span class="badge ${esTecnico ? 'bg-primary' : 'bg-secondary'} ms-2">
                                ${esTecnico ? 'Técnico' : 'Cliente'}
                            </span>
                        </div>
                        <button class="btn btn-sm ${esTecnico ? 'btn-outline-secondary' : 'btn-outline-primary'} btn-cambiar-rol"
                            data-id="${u.id}" data-rol="${esTecnico ? 3 : 2}">
                            ${esTecnico ? 'Degradar a Cliente' : 'Promover a Técnico'}
                        </button>
                    </div>`;
            });

            // Botón para cambiar el rol del usuario
            document.querySelectorAll('.btn-cambiar-rol').forEach(btn => {
                btn.addEventListener('click', async () => {
                    await axios.patch(`${AUTH_API}/usuarios/${btn.dataset.id}`, { rolid: parseInt(btn.dataset.rol) });
                    await cargarUsuarios();
                });
            });
        };

        // Carga y muestra todos los tickets
        const cargarTickets = async () => {
            const resp = await axios.get(`${TICKETS_API}/tickets`);
            const contenedor = document.getElementById('lista-tickets');
            contenedor.innerHTML = '';

            if (resp.data.length === 0) { contenedor.innerHTML = '<p>No hay tickets.</p>'; return; }

            resp.data.forEach(ticket => {
                const tecnico = ticket.tecnicoAsignado || 'Sin asignar';
                const cliente = (ticket.clienteNombre && ticket.clienteNombre !== 'N/A') ? ticket.clienteNombre : 'Admin';
                const badgeColor = ticket.estado === 'Cerrado' ? 'bg-success' : ticket.estado === 'En proceso' ? 'bg-warning text-dark' : 'bg-danger';
                contenedor.innerHTML += `
                    <div class="list-group-item list-group-item-action" style="cursor:pointer" data-id="${ticket.id}">
                        <div class="d-flex justify-content-between">
                            <h6 class="mb-1">${ticket.nombre} <span class="badge bg-info text-dark">${ticket.tipo}</span></h6>
                            <span class="badge ${badgeColor}">${ticket.estado}</span>
                        </div>
                        <small>Cliente: ${cliente} | Técnico: ${tecnico}</small>
                    </div>`;
            });

            // Al hacer click en un ticket abrimos el modal con sus datos
            document.querySelectorAll('#lista-tickets .list-group-item-action').forEach(item => {
                item.addEventListener('click', async () => {
                    const [respT, respU] = await Promise.all([
                        axios.get(`${TICKETS_API}/tickets/${item.dataset.id}`),
                        axios.get(`${AUTH_API}/usuarios`)
                    ]);
                    const t = respT.data;
                    const usuarios = respU.data;
                    ticketActualId = t.id;

                    document.getElementById('modal-titulo').textContent = t.nombre;
                    document.getElementById('modal-tipo').textContent = t.tipo;
                    document.getElementById('modal-desc').textContent = t.descripcion;
                    document.getElementById('select-estado').value = t.estado;

                    // Llenamos el select de clientes
                    const selCli = document.getElementById('select-cliente');
                    selCli.innerHTML = '<option value="">-- Admin (sin cliente) --</option>';
                    usuarios.filter(u => u.rolid === 3).forEach(c => {
                        selCli.innerHTML += `<option value="${c.id}|${c.nombre}" ${t.clienteId == c.id ? 'selected' : ''}>${c.nombre} (${c.correo})</option>`;
                    });

                    // Llenamos el select de técnicos
                    const selTec = document.getElementById('select-tecnico');
                    selTec.innerHTML = '<option value="">-- Sin asignar --</option>';
                    usuarios.filter(u => u.rolid === 2).forEach(tec => {
                        selTec.innerHTML += `<option value="${tec.nombre}" ${t.tecnicoAsignado === tec.nombre ? 'selected' : ''}>${tec.nombre}</option>`;
                    });

                    new bootstrap.Modal(document.getElementById('modalTicket')).show();
                });
            });
        };

        // Guarda los cambios del modal
        document.getElementById('btn-guardar-modal').addEventListener('click', async () => {
            if (!ticketActualId) return;
            const clienteVal = document.getElementById('select-cliente').value;
            let clienteId = 'N/A', clienteNombre = 'N/A';
            if (clienteVal) { const p = clienteVal.split('|'); clienteId = p[0]; clienteNombre = p[1]; }
            await axios.patch(`${TICKETS_API}/tickets/${ticketActualId}`, {
                clienteId, clienteNombre,
                tecnicoAsignado: document.getElementById('select-tecnico').value || null,
                estado: document.getElementById('select-estado').value
            });
            bootstrap.Modal.getInstance(document.getElementById('modalTicket')).hide();
            await cargarTickets();
        });

        // Elimina el ticket actual
        document.getElementById('btn-eliminar-modal').addEventListener('click', async () => {
            if (!ticketActualId) return;
            if (!confirm('¿Seguro que quieres eliminar este ticket?')) return;
            await axios.delete(`${TICKETS_API}/tickets/${ticketActualId}`);
            bootstrap.Modal.getInstance(document.getElementById('modalTicket')).hide();
            await cargarTickets();
        });

        // Crea un ticket nuevo desde el admin
        document.getElementById('btn-crear-admin').addEventListener('click', async () => {
            const nombre = document.getElementById('nombre-ticket-admin').value;
            const tipo = document.getElementById('tipo-ticket-admin').value;
            const desc = document.getElementById('desc-ticket-admin').value;
            if (!nombre || !desc) { alert('Completa título y descripción.'); return; }
            await axios.post(`${TICKETS_API}/tickets`, {
                nombre, tipo, descripcion: desc,
                clienteId: usuario.id,
                clienteNombre: `Admin (${usuario.nombre})`,
                tecnicoAsignado: null,
                estado: 'Abierto'
            });
            document.getElementById('nombre-ticket-admin').value = '';
            document.getElementById('desc-ticket-admin').value = '';
            await cargarTickets();
        });

        await cargarUsuarios();
        await cargarTickets();
    }
};

export default adminView;
