import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsersPosts } from '../services/post.service';

type User = {
    id: number;
    name: string;
    email: string;
    username: string;
    description: string;
    phone: string;
    profileLink: string;
}

type Post = {
    id: number;
    title: string;
    description: string;
    photoLink: string;
    videoLink: string;
    createdAt: string;
    likes: number;
    user: User;
};

type PostContextType = {
    posts: Post[];
    refreshPosts: () => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = () => {
        getUsersPosts()
            .then(setPosts)
            .catch((error) => {
                console.error('Erro ao buscar posts:', error);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <PostContext.Provider value={{ posts, refreshPosts: fetchPosts }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext deve ser usado dentro de PostProvider');
    }
    return context;
};