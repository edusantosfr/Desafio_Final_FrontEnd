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

export const getLogedUser = async () => {
    const response = await api.get('/users/loged');
    return response.data;
};

export const getUserInfo = async (id: string | number) => {
    const response = await api.get(`/users/user/${id}`);
    return response.data;
};

export const patchUserEdit = async (credentials: {
    profileLink: string;
    name: string;
    username: string;
    description: string;
}) => {
    const response = await api.patch('/users/update', credentials);
    return response.data;
};

export const patchUserInfo = async (credentials: {
    name: string;
    mail: string;
    phone: string;
    password: string;
}) => {
    const response = await api.patch('/users/update/info', credentials);
    return response.data;
};

export const deleteUser = () => {
    return api.patch('/users/delete');
};