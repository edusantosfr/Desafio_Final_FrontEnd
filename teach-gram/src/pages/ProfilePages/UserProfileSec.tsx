import no_profile from "../../assets/no-profile.png";
import like_button from "../../assets/like-button.png";
import correct_button from "../../assets/correct-button.png";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { getUserInfo, addFriend, removeFriend, getUserFriends, getMyFriends } from "../../services/user.service";
import { getUserPosts, patchPostLikes } from "../../services/post.service";
import { Modal } from "../ModalPages/Modal";

export function UserProfileSec() {
  const { userId } = useParams();

  const [status, setStatus] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<number | null>(null);

  const [myFriends, setMyFriends] = useState<Friend[]>([]);
  const [userFriends, setUserFriends] = useState<Friend[]>([]);

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

    const loadUserFriends = async () => {
      if (!userId) return;
      try {
        const data = await getUserFriends(userId);
        setUserFriends(data);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    };
    loadUserFriends();

    const loadMyFriends = async () => {
      try {
        const data = await getMyFriends();
        setMyFriends(data);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    };
    loadMyFriends();
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

  interface Friend {
    id: number;
    name: string,
    username: string,
    phone: string,
    mail: string,
    profileLink: string,
    description: string
  }

  const isFriend = (friendId: number) =>
    myFriends.some(friend => friend.id === friendId);

  const handleClick = async (friendId: number) => {
    if (!userId) return;
    try {
      if (isFriend(friendId)) {
        await removeFriend(friendId);
      } else {
        await addFriend(friendId);
      }

      const updatedMyFriends = await getMyFriends();
      setMyFriends(updatedMyFriends);

      const updatedUserFriends = await getUserFriends(userId);
      setUserFriends(updatedUserFriends);
    } catch (error) {
      console.error("Erro ao atualizar amizade:", error);
    }
  };

  const convertToEmbed = (url: string) => {
    const regex = /watch\?v=([\w-]+)/;
    const match = url.match(regex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  return (
    <div className="w-[1000px]
    sm:w-[700px]
    md:w-[700px]
    lg:w-[600px]
    xl:w-[1000px]
    2xl:w-[1000px]">
      {status ? (
        <LoadingSpinnerSmall />
      ) : (
        <div className="grid grid-rows-[auto_auto] justify-center w-full
        sm:w-full
        md:w-full
        lg:w-full
        xl:w-[80%]
        2xl:w-full">
          <section className="flex py-[60px] gap-20 w-full max-w-screen-lg mx-auto
          sm:gap-20 sm:py-[60px]
          md:gap-20 md:py-[60px]
          lg:gap-10 lg:py-[40px]
          xl:gap-20 xl:py-[60px]
          2xl:gap-20 2xl:py-[60px]">
            <img className="rounded-full object-cover aspect-square w-70 h-70
            sm:w-60 sm:h-60 
            md:w-60 md:h-60 
            lg:w-50 lg:h-50 
            xl:w-60 xl:h-60
            2xl:w-70 2xl:h-70"
              src={user.profileLink || no_profile}
              alt="foto de perfil" />

            <div className="flex flex-col pt-10 gap-4 max-w-140
            sm:max-w-140
            md:max-w-140
            lg:max-w-80
            xl:max-w-100
            2xl:max-w-140">
              <h1 className="capitalize text-[25px] font-semibold text-[#303030] break-words
              sm:text-[25px]
              md:text-[25px]
              lg:text-[20px]
              xl:text-[20px]
              2xl:text-[25px]">{user.name}</h1>
              <div className="text-[20px] text-[#6b6b6b] font-light w-full h-fit break-words
              sm:text-[20px]
              md:text-[20px]
              lg:text-[16px]
              xl:text-[18px]
              2xl:text-[20px]">{user.description}</div>
              {isFriend(user.id) ? (
                <button
                  onClick={() => handleClick(user.id)}
                  className="flex items-center gap-1.5 py-0.5 rounded-[8px] text-[13px] text-[#666666] border-1 border-[#666666] cursor-pointer hover w-fit px-2
                  sm:text-[13px] sm:
                  md:text-[13px] md:
                  lg:text-[13px] lg:
                  xl:text-[15px] xl:
                  2xl:text-[15px] 2xl:">
                  <p>Amigos</p>
                  <img src={correct_button}
                    className="h-2"
                    alt="botão de correto" />
                </button>
              ) : (
                <button
                  onClick={() => handleClick(user.id)}
                  className=" py-0.5 rounded-[8px] text-[13px] cursor-pointer hover w-fit px-2 bg-[#F37671] text-white border-[#F37671]
                  sm:text-[13px] sm:
                  md:text-[13px] md:
                  lg:text-[13px] lg:
                  xl:text-[15px] xl:
                  2xl:text-[15px] 2xl:">
                  <p>Adicionar</p>
                </button>
              )}
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
                      <div className="h-fit w-[550px] bg-white rounded-[18px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.2)] flex flex-col
                      sm:w-[480px] sm:p-6
                      md:w-[480px] md:p-6
                      lg:w-[480px] lg:p-6
                      xl:w-[480px] xl:p-6
                      2xl:w-[550px] 2xl:p-8">
                        <div className="flex h-fit w-full justify-between items-start">
                          <section className="flex gap-8 w-full max-w-screen-lg mx-auto items-center
                          sm:gap-4
                          md:gap-4
                          lg:gap-4
                          xl:gap-4
                          2xl:gap-8">
                            <img className="rounded-full object-cover aspect-square w-22 h-22 cursor-pointer
                            sm:w-18 sm:h-18
                            md:w-18 md:h-18
                            lg:w-18 lg:h-18
                            xl:w-18 xl:h-18
                            2xl:w-22 2xl:h-22"
                              src={user.profileLink}
                              alt="foto de perfil" />

                            <div className="flex flex-col max-w-[650px]">
                              <h1 className="capitalize text-[25px] font-light text-[#8E8E8E] break-words cursor-pointer
                              sm:text-[22px]
                              md:text-[22px]
                              lg:text-[22px]
                              xl:text-[22px]
                              2xl:text-[25px]">{user.username}</h1>

                              <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[300px] h-fit break-words
                              sm:text-[20px]
                              md:text-[20px]
                              lg:text-[20px]
                              xl:text-[18px]
                              2xl:text-[20px]">{tempoFormatado}</div>
                            </div>
                          </section>
                        </div>
                        <div className="flex flex-col mt-5 gap-5 w-full
                        sm:gap-3
                        md:gap-3
                        lg:gap-3
                        xl:gap-3
                        2xl:gap-5">
                          <div className="flex flex-col gap-1
                          sm:gap-0
                          md:gap-0
                          lg:gap-0
                          xl:gap-0
                          2xl:gap-1">
                            <div className="text-[20px] text-[#4d4d4d] font-semibold w-full max-w-[480px] h-fit break-words
                            sm:text-[18px]
                            md:text-[18px]
                            lg:text-[18px]
                            xl:text-[18px]
                            2xl:text-[20px]">{post.title}</div>
                            <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words
                            sm:text-[16px]
                            md:text-[16px]
                            lg:text-[16px]
                            xl:text-[16px]
                            2xl:text-[20px]">{post.description}</div>
                          </div>

                          {post.videoLink ? (
                            <iframe
                              className="w-full h-[320px] rounded-[8px]
                              sm:h-[280px]
                              md:h-[280px]
                              lg:h-[280px]
                              xl:h-[280px]
                              2xl:h-[320px]"
                              src={convertToEmbed(post.videoLink)}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <img
                              className="object-cover w-full h-full max-h-[360px]  cursor-pointer rounded-[8px]"
                              src={post.photoLink}
                              alt="foto de perfil"
                            />
                          )}

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
                <h1 className="capitalize text-[20px] font-semibold text-[#303030]
                sm:text-[20px]
                md:text-[20px]
                lg:text-[18px]
                xl:text-[20px]
                2xl:text-[20px]">{posts.length}</h1>
                <p className="text-[20px] text-[#6b6b6b] font-light
                sm:text-[20px]
                md:text-[20px]
                lg:text-[16px]
                xl:text-[18px]
                2xl:text-[20px]">Posts</p>
              </div>

              <div className="mt-1 w-[1px] h-10 bg-[#DBDADA] mx-10
              sm:mx-10
              md:mx-10
              lg:mx-8
              xl:mx-8
              2xl:mx-10"></div>

              <div className="flex flex-col items-center">
                <h1 className="capitalize text-[20px] font-semibold text-[#303030]
                sm:text-[20px]
                md:text-[20px]
                lg:text-[18px]
                xl:text-[20px]
                2xl:text-[20px]">{userFriends.length}</h1>
                <p className="text-[20px] text-[#6b6b6b] font-light
                sm:text-[20px]
                md:text-[20px]
                lg:text-[16px]
                xl:text-[18px]
                2xl:text-[20px]">Amigos</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1
            sm:grid-cols-3
            md:grid-cols-3
            lg:grid-cols-3
            xl:grid-cols-3
            2xl:grid-cols-4">
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