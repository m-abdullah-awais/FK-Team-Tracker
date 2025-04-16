import axios from 'axios';
import { API_BASE_URL } from '../constants/API_BASE_URL';

const API_URL = `${API_BASE_URL}/todos`;

const getAuthHeaders = () => {
    const token = JSON.parse(localStorage.getItem('fk-user-access'));
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const todoService = {
    getAllTodos: async () => {
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders()
        });
        return response.data.data;
    },

    createTodo: async (title) => {
        const response = await axios.post(API_URL, 
            { title }, 
            { headers: getAuthHeaders() }
        );
        return response.data.data;
    },

    updateTodoStatus: async (todoId, status) => {
        const response = await axios.patch(`${API_URL}/${todoId}`,
            { status },
            { headers: getAuthHeaders() }
        );
        return response.data.data;
    },

    deleteTodo: async (todoId) => {
        await axios.delete(`${API_URL}/${todoId}`, {
            headers: getAuthHeaders()
        });
    }
};

export default todoService;