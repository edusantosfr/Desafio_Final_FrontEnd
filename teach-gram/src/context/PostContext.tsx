import { createContext, useContext, useState, ReactNode } from "react";

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

interface PostContextType {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPostsState] = useState<Post[]>([]);

  const setPosts = (newPosts: Post[]) => {
    setPostsState(newPosts);
  };

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts deve estar dentro de <PostProvider>");
  return context;
};