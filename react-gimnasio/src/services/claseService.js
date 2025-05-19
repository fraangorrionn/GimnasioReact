import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/clases/`;

export const obtenerClases = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clases:', error);
    throw error;
  }
};
