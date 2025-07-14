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

export const loginUser = async (user: {
    mail: string;
    password: string;
}) => {
    const response = await api.post('/users/login', user);
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

export const patchUserEdit = async (user: {
    profileLink: string;
    name: string;
    username: string;
    description: string;
}) => {
    const response = await api.patch('/users/update', user);
    return response.data;
};

export const patchUserInfo = async (user: {
    name: string;
    mail: string;
    phone: string;
    password: string;
}) => {
    const response = await api.patch('/users/update/info', user);
    return response.data;
};

export const getFriends = async () => {
    const response = await api.get(`/users/friends`);
    return response.data;
};

export const addFriend = async (friendId: number) => {
    await api.post(`/users/friends/${friendId}/add`);
};

export const removeFriend = async (friendId: number) => {
    await api.delete(`/users/friends/${friendId}/remove`);
};

export const deleteUser = () => {
    return api.patch('/users/delete');
};