import api from './api';

export const createPost = async (user: {
    title: string;
    description: string;
    photoLink: string;
    videoLink: string;
    privatePost: boolean;
}) => {
    const response = await api.post('/posts/create', user);
    return response.data;
};

export const getAllMyPosts = async () => {
    const response = await api.get('/posts/allMyPosts');
    return response.data;
};

export const getUsersPosts = async () => {
    const response = await api.get('/posts/users/public');
    return response.data;
};