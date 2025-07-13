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

export const getMyPostById = async (userId: string | number) => {
    const response = await api.get(`/posts/${userId}`);
    return response.data;
};

export const getUserPosts = async (userId: string | number) => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
};

export const getUsersPosts = async () => {
    const response = await api.get('/posts/users/public');
    return response.data;
};

export const patchPostLikes = async (postId: number) => {
    await api.patch(`/posts/${postId}/update/likes`);
};

export const editPost = async (postId: number, post: {
    title: string;
    description: string;
    photoLink: string;
    videoLink: string;
    privatePost: boolean;
}) => {
    const response = await api.patch(`/posts/${postId}/update`, post);
    return response.data;
};

export const deletePost = async (postId: number) => {
    await api.patch(`/posts/${postId}/delete`);
};