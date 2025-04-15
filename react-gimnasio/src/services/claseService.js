import axios from 'axios';

const API_URL = 'http://localhost:8000/api/clases/';  // Ajusta si tu backend tiene otra ruta base

export const obtenerClases = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clases:', error);
    throw error;
  }
};
