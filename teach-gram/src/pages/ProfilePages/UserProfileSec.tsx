import no_profile from "../../assets/no-profile.png";
import like_button from "../../assets/like-button.png";
import correct_button from "../../assets/correct-button.png";
import back_button from "../../assets/backButton.png";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { getUserInfo, addFriend, removeFriend, getUserFriends, getMyFriends } from "../../services/user.service";
import { getUserPosts, patchPostLikes } from "../../services/post.service";
import { Modal } from "../ModalPages/Modal";

export function UserProfileSec() {
  const navigate = useNavigate();
  const { userId } = useParams();

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

  const handleVoltar = () => {
    const logo = document.getElementById("logo");
    const menu = document.getElementById("menu");

    if (logo) logo.style.display = "flex";
    if (menu) menu.style.display = "flex";

    navigate('/Profile/feed');
  }
  
  useEffect(() => {
    const logo = document.getElementById("logo");
    const menu = document.getElementById("menu");

    const updateProfilePage = () => {
      const width = window.innerWidth;

      if (width < 640) {
        if (logo) logo.style.display = "none";
        if (menu) menu.style.display = "none";
      } else {
        if (logo) logo.style.display = "flex";
        if (menu) menu.style.display = "flex";
      }
    }
    updateProfilePage();
    window.addEventListener("resize", updateProfilePage);

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

    return () => {
      window.removeEventListener("resize", updateProfilePage);
    };
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
    <div className="w-full
    sm:w-full
    md:w-full
    lg:w-[700px]
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
          <section className="flex pt-[30px] pb-[20px] gap-0 w-full max-w-screen-lg mx-auto px-[40px] flex-col items-center
          sm:gap-0 sm:py-[40px] sm:px-[0px] sm:flex-col sm:items-center
          md:gap-10 md:py-[50px] md:px-[50px] md:flex-row md:items-start
          lg:gap-15 lg:py-[40px] lg:px-[0px] lg:flex-row lg:items-start
          xl:gap-20 xl:py-[60px] xl:px-[0px] xl:flex-row xl:items-start
          2xl:gap-20 2xl:py-[60px] 2xl:px-[0px] 2xl:flex-row 2xl:items-start">
            <div className="w-full flex flex-col gap-5
            sm:gap-0 sm:w-full
            md:gap-0 md:w-fit
            lg:gap-0 lg:w-fit
            xl:gap-0 xl:w-fit
            2xl:gap-0 2xl:w-fit">
              <button type="button"
                onClick={handleVoltar}
                className="flex cursor-pointer
                sm:hidden
                md:hidden
                lg:hidden
                xl:hidden
                2xl:hidden">
                <img src={back_button} alt="botão de fechar modal"
                  className="w-[14px] h-[14px]
                  sm:w-[18px] sm:h-[18px]
                  md:w-[18px] md:h-[18px]
                  lg:w-[18px] lg:h-[18px]
                  xl:w-[18px] xl:h-[18px] 
                  2xl:w-[18px] 2xl:h-[18px]" />
              </button>
              <div className="w-full flex justify-center
              sm:w-full sm:justify-center
              md:w-fit md:justify-start
              lg:w-fit lg:justify-start
              xl:w-fit xl:justify-start
              2xl:w-fit 2xl:justify-start">
                <img className="rounded-full object-cover aspect-square w-35 h-35
                sm:w-50 sm:h-50 sm: sm:
                md:w-55 md:h-55 md: md:
                lg:w-50 lg:h-50 lg: lg:
                xl:w-60 xl:h-60 xl: xl:
                2xl:w-70 2xl:h-70 2xl: 2xl:"
                  src={user.profileLink || no_profile}
                  alt="foto de perfil" />
              </div>
            </div>

            <div className="flex flex-col pt-5 gap-2 max-w-60
            sm:max-w-100 sm:pt-10 sm:gap-4
            md:max-w-100 md:pt-10 md:gap-4
            lg:max-w-90 lg:pt-10 lg:gap-4
            xl:max-w-100 xl:pt-10 xl:gap-4
            2xl:max-w-140 2xl:pt-10 2xl:gap-4">
              <h1 className="capitalize text-[18px] font-semibold text-[#303030] break-words text-center
              sm:text-[22px] sm:text-center
              md:text-[22px] md:text-start
              lg:text-[20px] lg:text-start
              xl:text-[20px] xl:text-start
              2xl:text-[25px] 2xl:text-start">{user.name}</h1>
              <div className="text-[14px] text-[#6b6b6b] font-normal w-full h-fit break-words text-center
              sm:text-[18px] sm:text-center
              md:text-[18px] md:text-start
              lg:text-[16px] lg:text-start
              xl:text-[18px] xl:text-start
              2xl:text-[20px] 2xl:text-start">{user.description}</div>
              {isFriend(user.id) ? (
                <button
                  onClick={() => handleClick(user.id)}
                  className="items-center gap-1.5 py-0.5 rounded-[8px] text-[13px] text-[#666666] border-1 border-[#666666] cursor-pointer hover w-fit px-2 pr-0 hidden
                  sm:text-[13px] sm:hidden sm:pr-0
                  md:text-[13px] md:hidden md:pr-0
                  lg:text-[13px] lg:flex lg:pr-4
                  xl:text-[15px] xl:flex xl:pr-4
                  2xl:text-[15px] 2xl:flex 2xl:pr-4">
                  <p>Amigos</p>
                  <img src={correct_button}
                    className="h-2"
                    alt="botão de correto" />
                </button>
              ) : (
                <button
                  onClick={() => handleClick(user.id)}
                  className=" py-0.5 rounded-[8px] text-[13px] cursor-pointer hover w-fit px-2 bg-[#F37671] text-white border-[#F37671] hidden
                  sm:text-[13px] sm:hidden
                  md:text-[13px] md:hidden
                  lg:text-[13px] lg:flex
                  xl:text-[15px] xl:flex
                  2xl:text-[15px] 2xl:flex">
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
                      <div className="h-fit w-[280px] bg-white rounded-[18px] p-4 shadow-[0_0_10px_rgba(0,0,0,0.2)] flex flex-col items-end
                      sm:w-[480px] sm:p-6
                      md:w-[480px] md:p-6
                      lg:w-[480px] lg:p-6
                      xl:w-[480px] xl:p-6
                      2xl:w-[550px] 2xl:p-8">
                        <div className="flex h-fit w-full justify-between items-start">
                          <section className="flex gap-3 w-full max-w-screen-lg mx-auto items-center
                          sm:gap-4
                          md:gap-4
                          lg:gap-4
                          xl:gap-4
                          2xl:gap-8">
                            <img className="rounded-full object-cover aspect-square w-12 h-12 cursor-pointer
                            sm:w-18 sm:h-18
                            md:w-18 md:h-18
                            lg:w-18 lg:h-18
                            xl:w-18 xl:h-18
                            2xl:w-22 2xl:h-22"
                              src={user.profileLink}
                              alt="foto de perfil" />

                            <div className="flex flex-col max-w-[650px]">
                              <h1 className="capitalize text-[16px] font-light text-[#8E8E8E] break-words cursor-pointer
                              sm:text-[22px]
                              md:text-[22px]
                              lg:text-[22px]
                              xl:text-[22px]
                              2xl:text-[25px]">{user.username}</h1>

                              <div className="text-[14px] text-[#8E8E8E] font-light w-full max-w-[300px] h-fit break-words
                              sm:text-[20px]
                              md:text-[20px]
                              lg:text-[20px]
                              xl:text-[18px]
                              2xl:text-[20px]">{tempoFormatado}</div>
                            </div>
                          </section>
                        </div>
                        <div className="flex flex-col mt-3 gap-2 w-full
                        sm:gap-3 sm:mt-5
                        md:gap-3 md:mt-5
                        lg:gap-3 lg:mt-5
                        xl:gap-3 xl:mt-5
                        2xl:gap-5 2xl:mt-5">
                          <div className="flex flex-col gap-0
                          sm:gap-0
                          md:gap-0
                          lg:gap-0
                          xl:gap-0
                          2xl:gap-1">
                            <div className="text-[14px] text-[#4d4d4d] font-semibold w-full max-w-[480px] h-fit break-words
                            sm:text-[18px]
                            md:text-[18px]
                            lg:text-[18px]
                            xl:text-[18px]
                            2xl:text-[20px]">{post.title}</div>
                            <div className="text-[14px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words
                            sm:text-[16px]
                            md:text-[16px]
                            lg:text-[16px]
                            xl:text-[16px]
                            2xl:text-[20px]">{post.description}</div>
                          </div>

                          {post.videoLink ? (
                            <iframe
                              className="w-full h-[180px] rounded-[8px]
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
                              className="object-cover w-full h-full max-h-[280px] cursor-pointer rounded-[8px] 
                              sm:max-h-[400px]
                              md:max-h-[400px]
                              lg:max-h-[400px]
                              xl:max-h-[400px]
                              2xl:max-h-[400px]"
                              src={post.photoLink}
                              alt="foto de perfil"
                            />
                          )}

                          <div className="flex items-center gap-2
                          sm:gap-5
                          md:gap-5
                          lg:gap-5
                          xl:gap-5
                          2xl:gap-5">
                            <button onClick={() => handlePostLikes(post.id)}
                              className="cursor-pointer">
                              <img className="h-6
                              sm:h-10
                              md:h-10
                              lg:h-10
                              xl:h-10
                              2xl:h-10"
                                src={like_button}
                                alt="botão de curtida" />
                            </button>
                            <div className="text-[14px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words
                            sm:text-[20px]
                            md:text-[20px]
                            lg:text-[20px]
                            xl:text-[20px]
                            2xl:text-[20px]">{post.likes} curtidas</div>
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
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <h1 className="text-[16px] font-semibold text-[#303030]
                sm:text-[18px]
                md:text-[20px]
                lg:text-[18px]
                xl:text-[20px]
                2xl:text-[20px]">{posts.length}</h1>
                <p className="text-[14px] text-[#6b6b6b] font-normal
                sm:text-[18px]
                md:text-[18px]
                lg:text-[16px]
                xl:text-[18px]
                2xl:text-[20px]">Posts</p>
              </div>

              <div className="mt-1 w-[1px] h-8 bg-[#DBDADA] mx-3
              sm:mx-8 sm:h-10
              md:mx-10 md:h-10
              lg:mx-8 lg:h-10
              xl:mx-8 xl:h-10
              2xl:mx-10 2xl:h-10"></div>

              <div className="flex flex-col items-center">
                <h1 className="text-[16px] font-semibold text-[#303030]
                sm:text-[18px]
                md:text-[20px]
                lg:text-[18px]
                xl:text-[20px]
                2xl:text-[20px]">{userFriends.length}</h1>
                <p className="text-[14px] text-[#6b6b6b] font-normal
                sm:text-[18px]
                md:text-[20px]
                lg:text-[16px]
                xl:text-[18px]
                2xl:text-[20px]">Amigos</p>
              </div>

              {isFriend(user.id) ? (
                <button
                  onClick={() => handleClick(user.id)}
                  className="ml-5 flex items-center gap-1.5 py-0.5 rounded-[8px] text-[12px] text-[#666666] border-1 border-[#666666] cursor-pointer hover w-fit px-2 h-7
                  sm:text-[13px] sm:flex sm:ml-10 sm:h-8
                  md:text-[13px] md:flex md:ml-10 md:h-8
                  lg:text-[13px] lg:hidden lg:ml-10 lg:h-8
                  xl:text-[15px] xl:hidden xl:ml-10 xl:h-8
                  2xl:text-[15px] 2xl:hidden 2xl:ml-10 2xl:h-8">
                  <p>Amigos</p>
                  <img src={correct_button}
                    className="h-2"
                    alt="botão de correto" />
                </button>
              ) : (
                <button
                  onClick={() => handleClick(user.id)}
                  className="ml-10 py-0.5 rounded-[8px] text-[12px] cursor-pointer hover w-fit px-2 bg-[#F37671] text-white border-[#F37671] flex h-8 items-center
                  sm:text-[13px] sm:flex
                  md:text-[13px] md:flex
                  lg:text-[13px] lg:hidden
                  xl:text-[15px] xl:hidden
                  2xl:text-[15px] 2xl:hidden">
                  <p>Adicionar</p>
                </button>
              )}

            </div>
            <div className="grid grid-cols-3 gap-0.5
            sm:grid-cols-3 sm:gap-1
            md:grid-cols-3 md:gap-1
            lg:grid-cols-3 lg:gap-1
            xl:grid-cols-3 xl:gap-1
            2xl:grid-cols-4 2xl:gap-1">
              {posts.map(post => (
                <div key={post.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalOpen(post.id);
                  }}>
                  <img src={post.photoLink}
                    alt="Imagem de Post"
                    className="object-cover aspect-square h-full" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}