import api from './api';

export const createUser = async (user: {
    name: string;
    username: string;
    phone: string;
    mail: string;
    password: string;
    profileLink: string;
    description: string;
}) => {
    const response = await api.post('/users/register', user);
    return response.data;
};

export const loginUser = async (credentials: {
    mail: string;
    password: string;
}) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
};

export const deleteUser = () => {
    return api.patch("/users/delete");
};