import no_profile from "../../assets/no-profile.png";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { getUserInfo, addFriend, removeFriend } from "../../services/user.service";
import { getUserPosts, patchPostLikes } from "../../services/post.service";
import { Modal } from "../ModalPages/Modal";
import like_button from "../../assets/like-button.png";

export function UserProfileSec() {
  const { userId } = useParams();

  const [status, setStatus] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<number | null>(null);

  const [newFriendId, setNewFriendId] = useState('');

  const [user, setUser] = useState({
    id: 0,
    name: '',
    username: '',
    phone: '',
    mail: '',
    profileLink: '',
    description: ''
  })

  type Post = {
    id: number;
    title: string;
    description: string;
    photoLink: string;
    videoLink: string;
    createdAt: string;
    likes: number;
  };

  useEffect(() => {
    const handleUserInfo = async () => {
      setStatus(true);
      if (!userId) return;

      try {
        const user = await getUserInfo(userId);
        setUser({
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
          mail: user.mail,
          profileLink: user.profileLink,
          description: user.description
        });

      } catch (error) {
        console.error("Erro ao pegar o user:", error);
      } finally {
        setStatus(false);
      }
    }
    handleUserInfo()

    const handlePosts = async () => {
      if (!userId) return;
      try {
        const data = await getUserPosts(userId);
        setPosts(data);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    };
    handlePosts();
  }, [])

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
  }

  const handleAddFriend = async (friendId: number) => {
    try {
      await addFriend(friendId);
    } catch (error) {
      console.error('Erro ao adicionar amigo:', error);
    }
  }

  const handleRemoveFriend = async (friendId: number) => {
    try {
      await removeFriend(friendId);
    } catch (error) {
      console.error('Erro ao remover amigo:', error);
    }
  }

  return (
    <div className="w-[1000px]">
      {status ? (
        <LoadingSpinnerSmall />
      ) : (
        <div className="grid grid-rows-[auto_auto] justify-center w-full">
          <section className="flex py-[60px] gap-20 w-full max-w-screen-lg mx-auto">
            <img className="rounded-full object-cover aspect-square w-70 h-70"
              src={user.profileLink || no_profile}
              alt="foto de perfil" />

            <div className="flex flex-col pt-10 gap-4 max-w-[580px]">
              <h1 className="capitalize text-[25px] font-semibold text-[#303030] break-words">{user.name}</h1>
              <div className="text-[20px] text-[#6b6b6b] font-light w-full h-fit break-words">{user.description}</div>
              <button
                onClick={() => handleAddFriend(user.id)}
                className=" py-0.5 rounded-[8px] text-[15px] bg-[#F37671] text-white cursor-pointer
                hover">
                <p>Adicionar</p>
              </button>
            </div>
          </section>

          {posts.map((post) => {
            const tempoFormatado = formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ptBR,
            });
            return (
              <div key={post.id}>
                {modalOpen === post.id && (
                  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="h-fit flex flex-col gap-15">
                      <div className="h-fit w-[550px] bg-white rounded-[18px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.2)] flex flex-col">
                        <div className="flex h-fit w-full justify-between items-start">
                          <section className="flex gap-8 w-full max-w-screen-lg mx-auto items-center">
                            <img className="rounded-full object-cover aspect-square w-22 h-22 cursor-pointer"
                              src={user.profileLink}
                              alt="foto de perfil" />

                            <div className="flex flex-col max-w-[650px]">
                              <h1 className="capitalize text-[25px] font-light text-[#8E8E8E] break-words cursor-pointer">{user.username}</h1>

                              <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[300px] h-fit break-words">{tempoFormatado}</div>
                            </div>
                          </section>
                        </div>
                        <div className="flex flex-col mt-5 gap-5 w-full">
                          <div className="flex flex-col gap-1">
                            <div className="text-[20px] text-[#4d4d4d] font-semibold w-full max-w-[480px] h-fit break-words">{post.title}</div>
                            <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words">{post.description}</div>
                          </div>

                          <img className="object-cover w-full h-full max-h-[500px] cursor-pointer rounded-[8px]"
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
                  </Modal>
                )}
              </div>
            )
          })}

          <section className="flex flex-col items-center gap-5">
            <div className="flex">
              <div className="flex flex-col items-center">
                <h1 className="capitalize text-[20px] font-semibold text-[#303030]">{posts.length}</h1>
                <p className="text-[20px] text-[#6b6b6b] font-light">Posts</p>
              </div>

              <div className="mt-1 w-[1px] h-10 bg-[#DBDADA] mx-10"></div>

              <div className="flex flex-col items-center">
                <h1 className="capitalize text-[20px] font-semibold text-[#303030]">100</h1>
                <p className="text-[20px] text-[#6b6b6b] font-light">Amigos</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {posts.map(post => (
                <div key={post.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalOpen(post.id);
                  }}>
                  <img src={post.photoLink}
                    alt="Imagem de Post"
                    className="object-cover aspect-square" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}