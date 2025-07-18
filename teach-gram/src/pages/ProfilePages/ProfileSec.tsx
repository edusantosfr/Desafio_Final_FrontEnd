import no_profile from "../../assets/no-profile.png";
import close_button from "../../assets/close-button.png";
import back_button from "../../assets/backButton.png";
import post_hamburguer from "../../assets/post-hamburguer.png";
import like_button from "../../assets/like-button.png";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from "react-router-dom";

import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { Modal } from "../ModalPages/Modal";
import { getLogedUser, getMyFriends } from "../../services/user.service";
import { getAllMyPosts, editPost, getMyPostById, deletePost, patchPostLikes } from "../../services/post.service";

export function ProfileSec() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  //const [status, setStatus] = useState(false);

  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState<number | null>(null);

  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<number | null>(null);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  const [user, setUser] = useState({
    id: 0,
    name: '',
    username: '',
    phone: '',
    mail: '',
    profileLink: '',
    description: ''
  })

  interface Friend {
    id: number;
    name: string,
    username: string,
    phone: string,
    mail: string,
    profileLink: string,
    description: string
  }

  type Post = {
    id: number;
    title: string;
    description: string;
    photoLink: string;
    videoLink: string;
    createdAt: string;
    likes: number;
  }

  const handleVoltar = () => {
    const logo = document.getElementById("logo");
    const menu = document.getElementById("menu");

    if (logo) logo.style.display = "flex";
    if (menu) menu.style.display = "flex";

    navigate(-1);
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

    const handleLogedUser = async () => {
      try {
        const user = await getLogedUser();
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
    handleLogedUser()


    const handlePosts = async () => {
      try {
        const data = await getAllMyPosts();
        setPosts(data);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    }
    handlePosts()


    const loadFriends = async () => {
      try {
        const data = await getMyFriends();
        setFriends(data);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    }
    loadFriends()

    return () => {
      window.removeEventListener("resize", updateProfilePage);
    }
  }, [])

  const handlePostDelete = async (postId: number) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error("Erro ao curtir:", error);
    } finally {
      setIsDeletePostModalOpen(true);
      setDeleteModalOpen(null);
      setModalOpen(null);
      setIsModalOpen(false);
      window.location.reload();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    setEditPostData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const [editPostData, setEditPostData] = useState({
    title: '',
    description: '',
    photoLink: '',
    videoLink: '',
    privatePost: false
  })

  const handlePostEdit = async (postId: number) => {
    try {
      await editPost(postId, editPostData);
    } catch (error) {
      console.error("Erro ao curtir:", error);
    } finally {
      setIsDeletePostModalOpen(true);
      setDeleteModalOpen(null);
      setModalOpen(null);
      setIsModalOpen(false);
      window.location.reload();
    }
  }

  const handleOpenEditModal = async (postId: number) => {
    try {
      const post = await getMyPostById(postId);
      setEditPostData({
        title: post.title,
        description: post.description,
        photoLink: post.photoLink,
        videoLink: post.videoLink,
        privatePost: post.privatePost
      })
      setEditModalOpen(postId);
    } catch (error) {
      console.error("Erro ao carregar post:", error);
    }
  }

  const handlePostLikes = async (postId: number) => {
    try {
      await patchPostLikes(postId);

      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      )
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  }

  const convertToEmbed = (url: string) => {
    const regex = /watch\?v=([\w-]+)/;
    const match = url.match(regex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  }

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
            sm:gap-0
            md:gap-0
            lg:gap-0
            xl:gap-0
            2xl:gap-0">
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
              <div className="w-full flex justify-center">
                <img className="rounded-full object-cover aspect-square w-35 h-35
                sm:w-50 sm:h-50 
                md:w-55 md:h-55
                lg:w-50 lg:h-50 
                xl:w-60 xl:h-60
                2xl:w-70 2xl:h-70"
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
                      <div className="h-fit w-[550px] bg-white rounded-[18px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.2)] flex flex-col items-end
                      sm:w-[480px] sm:p-6
                      md:w-[480px] md:p-6
                      lg:w-[480px] lg:p-6
                      xl:w-[480px] xl:p-6
                      2xl:w-[550px] 2xl:p-8">
                        {activePostId === post.id && (
                          <div className="-translate-x-5 absolute w-24 bg-white border border-[#E2E2E2] shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[8px] z-10 flex flex-col items-center justify-center">
                            <button type="button"
                              className="flex justify-center w-full px-4 pb-1 pt-2 text-left hover:bg-gray-100"
                              onClick={() => {
                                setModalOpen(null);
                                setIsModalOpen(false);
                                setIsEditPostModalOpen(true);
                                handleOpenEditModal(post.id);
                              }}>
                              <p className="text-[15px] text-[#F37671] font-medium">Editar</p>
                            </button>
                            <button type="button"
                              className="flex justify-center w-full px-4 pb-2 pt-1 text-left hover:bg-gray-100"
                              onClick={() => {
                                setIsDeletePostModalOpen(true);
                                setDeleteModalOpen(post.id);
                              }}>
                              <p className="text-[15px] text-[#F37671] font-medium">Excluir</p>
                            </button>
                          </div>
                        )}

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
                              src={user.profileLink || undefined}
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
                          <button type="button"
                            onClick={() => {
                              setActivePostId(activePostId === post.id ? null : post.id)
                            }}
                            className="cursor-pointer w-4 flex justify-center">
                            <img className="h-7"
                              src={post_hamburguer}
                              alt="hamburguer" />
                          </button>
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
                              src={convertToEmbed(post.videoLink) || undefined}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <img
                              className="object-cover w-full h-full max-h-[360px] cursor-pointer rounded-[8px]"
                              src={post.photoLink || undefined}
                              alt="foto de perfil"
                            />
                          )}

                          <div className="flex items-center gap-5">
                            <button type="button"
                              onClick={() => {
                                handlePostLikes(post.id)
                              }}
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

                {deleteModalOpen === post.id && (
                  <Modal isOpen={isDeletePostModalOpen} onClose={() => setIsDeletePostModalOpen(false)}>
                    <div className="bg-white rounded-[30px] shadow-lg z-60 max-w-lg w-fit h-fit flex flex-col items-center p-12 gap-8">
                      <h2 className="text-[24px] font-semibold text-[#303030]">Excluir Publicação?</h2>
                      <div className="flex items-center justify-center">
                        <div className="flex flex-col w-[80%] gap-10">
                          <div className="flex justify-center gap-12">
                            <button type="button"
                              onClick={() => {
                                setIsDeletePostModalOpen(false)
                              }}
                              className="px-10 py-0.5 rounded-[8px] text-[15px] border-[#F37671] border-1 text-[#F37671] cursor-pointer">
                              Cancelar
                            </button>
                            <button type="button"
                              onClick={() => {
                                handlePostDelete(post.id)
                              }}
                              className="px-10 py-0.5 bg-[#F37671] text-white rounded-[8px] text-[15px] cursor-pointer">
                              Confirmar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                )}

                {editModalOpen === post.id && (
                  <Modal isOpen={isEditPostModalOpen} onClose={() => setIsEditPostModalOpen(false)}>
                    <section className="bg-white rounded-[30px] shadow-lg z-60 w-[528px] flex justify-center items-center
                    sm:w-[460px]
                    md:w-[460px]
                    lg:w-[460px]
                    xl:w-[460px]
                    2xl:w-[528px]">
                      <div className="w-full h-full flex flex-col p-7
                      sm:p-6
                      md:p-6
                      lg:p-6
                      xl:p-6
                      2xl:p-7">
                        <button type="button"
                          onClick={() => {
                            setIsEditPostModalOpen(false)
                          }}
                          className="flex cursor-pointer">
                          <img src={close_button} alt="botão de fechar modal"
                            className="w-[18px] h-[18px]
                            sm:w-[16px] sm:h-[16px]
                            md:w-[16px] md:h-[16px]
                            lg:w-[16px] lg:h-[16px]
                            xl:w-[16px] xl:h-[16px]
                            2xl:w-[16px] 2xl:h-[16px]" />
                        </button>

                        <form onSubmit={() => {
                          handlePostEdit(post.id);
                        }}
                          className="flex flex-col px-7 gap-5
                          sm:gap-3
                          md:gap-3
                          lg:gap-3
                          xl:gap-3
                          2xl:gap-5">
                          <div className="flex flex-row items-center justify-between">
                            <h1 className="text-[25px] font-semibold text-[#303030]
                            sm:text-[20px]
                            md:text-[20px]
                            lg:text-[20px]
                            xl:text-[20px]
                            2xl:text-[25px]">Editar publicação</h1>
                            <button type="submit"
                              className="flex cursor-pointer">
                              <p className="text-[#F37671] hover:underline
                              sm:text-[16px]
                              md:text-[16px]
                              lg:text-[16px]
                              xl:text-[16px]
                              2xl:text-[20px]">Salvar</p>
                            </button>
                          </div>
                          <div className="flex flex-col gap-3">
                            <img src={editPostData.photoLink || undefined}
                              alt="Imagem inserida"
                              className="h-90 w-full object-cover aspect-square rounded-2xl pb-2
                              sm:h-70
                              md:h-70
                              lg:h-70
                              xl:h-70
                              2xl:h-90" />

                            <div className="flex flex-col w-full max-w-xs">
                              <label htmlFor="photoLink" className="text-[15px] text-[#303030]">Link da Foto</label>
                              <input id="photoLink" name="photoLink" type="url" value={editPostData.photoLink} onChange={handleChange}
                                className="w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                                sm:w-89
                                md:w-89
                                lg:w-89
                                xl:w-89
                                2xl:w-100" />
                            </div>

                            <div className="flex flex-col w-full max-w-xs">
                              <label htmlFor="title" className="text-[15px] text-[#303030]">Título</label>
                              <input id="title" name="title" value={editPostData.title} onChange={handleChange}
                                type="text"
                                className="w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                                sm:w-89
                                md:w-89
                                lg:w-89
                                xl:w-89
                                2xl:w-100" />
                            </div>

                            <div className="flex flex-col w-full max-w-xs">
                              <label htmlFor="description" className="text-[15px] text-[#303030]">Descrição</label>
                              <input id="description" name="description" value={editPostData.description} onChange={handleChange}

                                type="text"
                                className="w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                                sm:w-89
                                md:w-89
                                lg:w-89
                                xl:w-89
                                2xl:w-100" />
                            </div>

                            <div className="flex flex-col w-full max-w-xs">
                              <label htmlFor="videoLink" className="text-[15px] text-[#303030]">Link do Vídeo 'Opcional'</label>
                              <input id="videoLink" name="videoLink" value={editPostData.videoLink} onChange={handleChange}
                                type="url"
                                className="w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                                sm:w-89
                                md:w-89
                                lg:w-89
                                xl:w-89
                                2xl:w-100" />
                            </div>
                          </div>

                          <label htmlFor="privatePost"
                            className="flex items-center gap-1 text-[15px] text-[#8E8E8E] cursor-pointer pb-5">
                            <input
                              type="checkbox"
                              name="privatePost"
                              id="privatePost"
                              checked={editPostData.privatePost}
                              onChange={handleChange} /> Post Privado
                          </label>
                        </form>
                      </div>
                    </section>
                  </Modal>
                )}
              </div>
            )
          })}

          <section className="flex flex-col items-center gap-5">
            <div className="flex">
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
                2xl:text-[20px]">{friends.length}</h1>
                <p className="text-[14px] text-[#6b6b6b] font-normal
                sm:text-[18px]
                md:text-[20px]
                lg:text-[16px]
                xl:text-[18px]
                2xl:text-[20px]">Amigos</p>
              </div>
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
                  <img src={post.photoLink || undefined}
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