import axios from 'axios';

// URL de tickets desde el .env
const TICKETS_API = import.meta.env.VITE_TICKETS_API;

// Objeto con funciones para manejar los tickets
const ticketService = {

    // Trae todos los tickets de la base de datos
    obtenerTodos: async () => {
        const respuesta = await axios.get(`${TICKETS_API}/tickets`);
        return respuesta.data;
    },

    // Guarda un ticket nuevo
    crear: async (nuevoTicket) => {
        await axios.post(`${TICKETS_API}/tickets`, nuevoTicket);
    }
};

export default ticketService;
