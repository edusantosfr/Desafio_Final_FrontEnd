import config_detail from "../../assets/config-detail.png";
import post_hamburguer from "../../assets/post-hamburguer.png";
import like_button from "../../assets/like-button.png";

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { patchPostLikes } from "../../services/post.service";
import { getUsersPosts } from "../../services/post.service";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

// import { Post } from "../Post";

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

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
  }

  useEffect(() => {
    getUsersPosts()
      .then(setPosts)
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handlePostLikes = async (postId: number) => {
    try {
      await patchPostLikes(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_300px] h-full">
      <div className="overflow-y-auto h-screen p-20 pt-45 flex flex-col gap-10">

        {posts.map((post) => {
          const tempoFormatado = formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: ptBR,
          })

          return (
            <div key={post.id}
              className="h-fit flex flex-col gap-15">
              <div className="h-fit w-[550px] bg-white rounded-[18px] p-8 shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col">
                <div className="flex h-fit w-full justify-between items-start">
                  <section className="flex gap-8 w-full max-w-screen-lg mx-auto items-center">

                    <img className="rounded-full object-cover aspect-square w-22 h-22 cursor-pointer"
                      src={post.user.profileLink}
                      alt="foto de perfil"
                      onClick={() => post.user.id === Number(userId) ? navigate('/Profile/profilesec') : navigate(`/Profile/profilesec/${post.user.id}`)}/>

                    <div className="flex flex-col max-w-[650px]">
                      <h1 onClick={() => post.user.id === Number(userId) ? navigate('/Profile/profilesec') : navigate(`/Profile/profilesec/${post.user.id}`)}
                        className="capitalize text-[25px] font-light text-[#8E8E8E] break-words cursor-pointer">{post.user.username}</h1>

                      <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[340px] h-fit break-words">{tempoFormatado}</div>
                    </div>
                  </section>
                  {post.user.id === Number(userId) && (
                    <button className="cursor-pointer w-4 flex justify-center">
                      <img className="h-7"
                        src={post_hamburguer}
                        alt="hamburguer" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col mt-5 gap-5">
                  <div className="flex flex-col gap-1">
                    <div className="text-[20px] text-[#4d4d4d] font-semibold w-full max-w-[480px] h-fit break-words">{post.title}</div>
                    <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words">{post.description}</div>
                  </div>

                  <img className="object-cover w-full h-full max-h-[400px] cursor-pointer rounded-[8px]"
                    src={post.photoLink}
                    alt="foto de perfil" />

                  <div className="flex items-center gap-5">
                    <button onClick={() => handlePostLikes(post.id)}
                      className="cursor-pointer">
                      <img className="h-10"
                        src={like_button}
                        alt="botão de curtida" />
                    </button>
                    <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words">{post.likes} curtidas</div>
                  </div>

                </div>
              </div>
            </div>
          )
        })}

      </div>
      <aside className="sticky top-0 self-start h-screen">
        <section className="flex items-center justify-end">
          <img src={config_detail} alt="login imagem" className=" h-screen" />
        </section>
      </aside>
    </div>
  )
}