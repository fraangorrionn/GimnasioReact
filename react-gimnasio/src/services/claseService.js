import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

export const obtenerClases = async () => {
  try {
    const response = await axios.get(`${API_URL}/clases/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clases:', error);
    throw error;
  }
};

export const obtenerCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias_clase/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};
