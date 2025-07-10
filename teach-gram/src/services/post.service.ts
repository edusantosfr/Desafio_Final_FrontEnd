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