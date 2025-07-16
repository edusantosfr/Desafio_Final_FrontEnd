import { createContext, useContext, useState, ReactNode } from "react";
import { createPost } from "../services/post.service"; // ajuste o caminho

type Post = {
  id: number;
  title: string;
  description: string;
  photoLink: string;
  videoLink: string;
  privatePost: boolean;
  createdAt: string;
  likes: number;
};

type PostForm = {
  title: string;
  description: string;
  photoLink: string;
  videoLink: string;
  privatePost: boolean;
};

interface PostContextType {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  createNewPost: (data: PostForm) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPostsState] = useState<Post[]>([]);

  const setPosts = (newPosts: Post[]) => {
    setPostsState(newPosts);
  };

  const createNewPost = async (data: PostForm) => {
    try {
      const post = await createPost(data);
      setPostsState(prev => [post, ...prev]);
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, createNewPost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts deve estar dentro de <PostProvider>");
  return context;
};