import config_detail from "../../assets/config-detail.png";
import post_hamburguer from "../../assets/post-hamburguer.png";
import like_button from "../../assets/like-button.png";
import close_button from "../../assets/close-button.png";

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getUsersPosts, editPost, getMyPostById, patchPostLikes, deletePost } from "../../services/post.service";
import { useNavigate } from "react-router-dom";
import { Modal } from "../ModalPages/Modal";

import { useEffect, useState } from "react";

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState<number | null>(null);

  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [activePostId, setActivePostId] = useState<number | null>(null);

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
  }

  const handlePostDelete = async (postId: number) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error("Erro ao curtir:", error);
    } finally {
      setIsDeletePostModalOpen(true);
      setDeleteModalOpen(null);
      window.location.reload();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    setEditPostData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
      });
      setEditModalOpen(postId);
    } catch (error) {
      console.error("Erro ao carregar post:", error);
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
    <div className="grid grid-cols-[1fr] h-full
    sm:grid-cols-[1fr]
    md:grid-cols-[1fr]
    lg:grid-cols-[1fr]
    xl:grid-cols-[1fr_300px]
    2xl:grid-cols-[1fr_300px]">
      <div className=" h-screen p-20 pt-4 flex flex-col gap-0 
      sm:pt-8 sm:p-10 sm:gap-0
      md:pt-8 md:p-10 md:gap-0
      lg:pt-8 lg:p-10 lg:gap-0 
      xl:pt-30 xl:p-10 xl:gap-8 xl:overflow-y-auto
      2xl:pt-45 2xl:p-20 2xl:gap-10 2xl:overflow-y-auto">

        {posts.map((post) => {
          const tempoFormatado = formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: ptBR,
          })

          return (
            <div key={post.id}
              className="h-fit flex flex-col">
              <div className="h-fit w-[300px] bg-white rounded-[12px] p-4 shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col items-end relative z-0 mb-6
              sm:w-[500px] sm:p-6 sm:mb-8 sm:rounded-[18px]
              md:w-[500px] md:p-6 md:mb-8 md:rounded-[18px]
              lg:w-[500px] lg:p-6 lg:mb-8 lg:rounded-[18px]
              xl:w-[500px] xl:p-6 xl:mb-0 xl:rounded-[18px]
              2xl:w-[550px] 2xl:p-8 2xl:mb-0 2xl:rounded-[18px]" >
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
                      src={post.user.profileLink || undefined}
                      alt="foto de perfil"
                      onClick={() => post.user.id === Number(userId) ? navigate('/Profile/profilesec') : navigate(`/Profile/profilesec/${post.user.id}`)} />

                    <div className="flex flex-col max-w-[650px]">
                      <h1 onClick={() => post.user.id === Number(userId) ? navigate('/Profile/profilesec') : navigate(`/Profile/profilesec/${post.user.id}`)}
                        className="capitalize text-[16px] font-light text-[#8E8E8E] break-words cursor-pointer
                        sm:text-[22px]
                        md:text-[22px]
                        lg:text-[22px]
                        xl:text-[22px]
                        2xl:text-[25px]">{post.user.username}</h1>

                      <div className="text-[14px] text-[#8E8E8E] font-light w-full max-w-[340px] h-fit break-words
                      sm:text-[20px]
                      md:text-[20px]
                      lg:text-[20px]
                      xl:text-[18px]
                      2xl:text-[20px]">{tempoFormatado}</div>
                    </div>
                  </section>

                  <section className="relative z-0">
                    {activePostId === post.id && (
                      <div className="absolute -translate-x-19 w-18 bg-white border border-[#E2E2E2] shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[8px] flex flex-col items-center justify-center
                      sm:w-24 sm:-translate-x-25
                      md:w-24 md:-translate-x-25
                      lg:w-24 lg:-translate-x-25
                      xl:w-24 xl:-translate-x-25
                      2xl:w-24 2xl:-translate-x-25">
                        <button
                          className="flex justify-center w-full px-4 pb-1 pt-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setIsEditPostModalOpen(true);
                            handleOpenEditModal(post.id);
                          }}>
                          <p className="text-[12px] text-[#F37671] font-medium
                          sm:text-[15px]
                          md:text-[15px]
                          lg:text-[15px]
                          xl:text-[15px]
                          2xl:text-[15px]">Editar</p>
                        </button>
                        <button
                          className="flex justify-center w-full px-4 pb-2 pt-1 text-left hover:bg-gray-100"
                          onClick={() => {
                            setIsDeletePostModalOpen(true);
                            setDeleteModalOpen(post.id);
                          }}>
                          <p className="text-[12px] text-[#F37671] font-medium
                          sm:text-[15px]
                          md:text-[15px]
                          lg:text-[15px]
                          xl:text-[15px]
                          2xl:text-[15px]">Excluir</p>
                        </button>
                      </div>
                    )}
                    {post.user.id === Number(userId) && (
                      <button onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                        className="cursor-pointer w-4 flex justify-center">
                        <img className="h-5
                        sm:h-7
                        md:h-7
                        lg:h-7
                        xl:h-7
                        2xl:h-7"
                          src={post_hamburguer}
                          alt="hamburguer" />
                      </button>
                    )}
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
                      src={convertToEmbed(post.videoLink) || undefined}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <img className="object-cover w-full h-full max-h-[280px] cursor-pointer rounded-[8px]
                    sm:max-h-[400px]
                    md:max-h-[400px]
                    lg:max-h-[400px]
                    xl:max-h-[400px]
                    2xl:max-h-[400px]"
                      src={post.photoLink || undefined}
                      alt="foto de perfil" />
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

              {deleteModalOpen === post.id && (
                <Modal isOpen={isDeletePostModalOpen} onClose={() => setIsDeletePostModalOpen(false)}>
                  <div className="bg-white rounded-[20px] shadow-lg z-60 max-w-[290px] w-fit h-fit flex flex-col items-center p-6 gap-6
                    sm:max-w-[512px] sm:rounded-[30px] sm:p-12 sm:gap-8
                    md:max-w-[512px] md:rounded-[30px] md:p-12 md:gap-8
                    lg:max-w-[512px] lg:rounded-[30px] lg:p-12 lg:gap-8
                    xl:max-w-[512px] xl:rounded-[30px] xl:p-12 xl:gap-8
                    2xl:max-w-[512px] 2xl:rounded-[30px] 2xl:p-12 2xl:gap-8">
                    <h2 className="text-[18px] font-semibold text-[#303030]
                      sm:text-[24px]
                      md:text-[24px]
                      lg:text-[24px]
                      xl:text-[24px]
                      2xl:text-[24px]">Excluir Publicação?</h2>
                    <div className="flex items-center justify-center">
                      <div className="flex flex-col w-[80%] gap-10">
                        <div className="flex justify-center gap-6
                        sm:gap-12
                        md:gap-12
                        lg:gap-12
                        xl:gap-12
                        2xl:gap-12">
                          <button
                            onClick={() => setIsDeletePostModalOpen(false)}
                            className="px-6 py-0.5 rounded-[8px] text-[12px] border-[#F37671] border-1 text-[#F37671] cursor-pointer
                            sm:text-[15px] sm:px-10
                            md:text-[15px] md:px-10
                            lg:text-[15px] lg:px-10
                            xl:text-[15px] xl:px-10
                            2xl:text-[15px] 2xl:px-10">
                            Cancelar
                          </button>
                          <button
                            onClick={() => handlePostDelete(post.id)}
                            className="px-6 py-0.5 bg-[#F37671] text-white rounded-[8px] text-[12px] cursor-pointer
                            sm:text-[15px] sm:px-10
                            md:text-[15px] md:px-10
                            lg:text-[15px] lg:px-10
                            xl:text-[15px] xl:px-10
                            2xl:text-[15px] 2xl:px-10">
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
                  <section className="bg-white rounded-[20px] shadow-lg z-60 w-[280px] flex justify-center items-center
                    sm:w-[460px] sm:rounded-[30px]
                    md:w-[460px] md:rounded-[30px]
                    lg:w-[460px] lg:rounded-[30px]
                    xl:w-[460px] xl:rounded-[30px]
                    2xl:w-[528px] 2xl:rounded-[30px]">
                    <div className="w-full h-full flex flex-col p-4
                    sm:p-6
                    md:p-6
                    lg:p-6
                    xl:p-6
                    2xl:p-7">
                      <button
                        onClick={() => setIsEditPostModalOpen(false)}
                        className="flex cursor-pointer">
                        <img src={close_button} alt="botão de fechar modal"
                          className="w-[12px] h-[12px]
                          sm:w-[16px] sm:h-[16px]
                          md:w-[16px] md:h-[16px]
                          lg:w-[16px] lg:h-[16px]
                          xl:w-[16px] xl:h-[16px]
                          2xl:w-[16px] 2xl:h-[16px]" />
                      </button>

                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handlePostEdit(post.id);
                      }}
                        className="flex flex-col px-1 gap-1 mt-2
                          sm:gap-3 sm:mt-0 sm:px-7
                          md:gap-3 md:mt-0 md:px-7
                          lg:gap-3 lg:mt-0 lg:px-7
                          xl:gap-3 xl:mt-0 xl:px-7
                          2xl:gap-5 2xl:mt-0 2xl:px-7">
                        <div className="flex flex-row items-center justify-between">
                          <h1 className="text-[14px] font-semibold text-[#303030]
                          sm:text-[20px]
                          md:text-[20px]
                          lg:text-[20px]
                          xl:text-[20px]
                          2xl:text-[25px]">Editar publicação</h1>
                          <button type="submit"
                            className="flex cursor-pointer">
                            <p className="text-[#F37671] hover:underline text-[14px]
                            sm:text-[16px]
                            md:text-[16px]
                            lg:text-[16px]
                            xl:text-[16px]
                            2xl:text-[20px]">Salvar</p>
                          </button>
                        </div>
                        <div className="flex flex-col gap-2
                        sm:gap-3
                        md:gap-3
                        lg:gap-3
                        xl:gap-3
                        2xl:gap-3">
                          <img src={editPostData.photoLink || undefined}
                            alt="Imagem inserida"
                            className="h-50 w-full object-cover aspect-square rounded-2xl pb-0
                            sm:h-70 sm:pb-2
                            md:h-70 md:pb-2
                            lg:h-70 lg:pb-2
                            xl:h-70 xl:pb-2
                            2xl:h-90 2xl:pb-2" />

                          <div className="flex flex-col w-full max-w-xs">
                            <label htmlFor="photoLink" className="text-[12px] text-[#303030]
                            sm:text-[15px]
                            md:text-[15px]
                            lg:text-[15px]
                            xl:text-[15px]
                            2xl:text-[15px]">Link da Foto</label>
                            <input id="photoLink" name="photoLink" type="url" value={editPostData.photoLink} onChange={handleChange}
                              className="px-1 w-60 truncate border-b-1 border-[#E6E6E6] text-[12px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                              sm:w-89 sm:text-[15px]
                              md:w-89 md:text-[15px]
                              lg:w-89 lg:text-[15px]
                              xl:w-89 xl:text-[15px]
                              2xl:w-100 2xl:text-[15px]" />
                          </div>

                          <div className="flex flex-col w-full max-w-xs">
                            <label htmlFor="title" className="text-[12px] text-[#303030]sm:text-[15px]
                            md:text-[15px]
                            lg:text-[15px]
                            xl:text-[15px]
                            2xl:text-[15px]">Título</label>
                            <input id="title" name="title" value={editPostData.title} onChange={handleChange}
                              type="text"
                              className="px-1 w-60 truncate border-b-1 border-[#E6E6E6] text-[12px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                              sm:w-89 sm:text-[15px]
                              md:w-89 md:text-[15px]
                              lg:w-89 lg:text-[15px]
                              xl:w-89 xl:text-[15px]
                              2xl:w-100 2xl:text-[15px]" />
                          </div>

                          <div className="flex flex-col w-full max-w-xs">
                            <label htmlFor="description" className="text-[12px] text-[#303030]
                            sm:text-[15px]
                            md:text-[15px]
                            lg:text-[15px]
                            xl:text-[15px]
                            2xl:text-[15px]">Descrição</label>
                            <input id="description" name="description" value={editPostData.description} onChange={handleChange}

                              type="text"
                              className="px-1 w-60 truncate border-b-1 border-[#E6E6E6] text-[12px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                              sm:w-89 sm:text-[15px]
                              md:w-89 md:text-[15px]
                              lg:w-89 lg:text-[15px]
                              xl:w-89 xl:text-[15px]
                              2xl:w-100 2xl:text-[15px]" />
                          </div>

                          <div className="flex flex-col w-full max-w-xs">
                            <label htmlFor="videoLink" className="text-[12px] text-[#303030]
                            sm:text-[15px]
                            md:text-[15px]
                            lg:text-[15px]
                            xl:text-[15px]
                            2xl:text-[15px]">Link do Vídeo 'Opcional'</label>
                            <input id="videoLink" name="videoLink" value={editPostData.videoLink} onChange={handleChange}
                              type="url"
                              className="px-1 w-60 truncate border-b-1 border-[#E6E6E6] text-[12px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                              sm:w-89 sm:text-[15px]
                              md:w-89 md:text-[15px]
                              lg:w-89 lg:text-[15px]
                              xl:w-89 xl:text-[15px]
                              2xl:w-100 2xl:text-[15px]" />
                          </div>
                        </div>

                        <label htmlFor="privatePost"
                          className="flex items-center gap-1 text-[12px] text-[#8E8E8E] cursor-pointer pb-0 pt-2
                          sm:text-[15px] sm:pb-5 sm:pt-0
                          md:text-[15px] md:pb-5 md:pt-0
                          lg:text-[15px] lg:pb-5 lg:pt-0
                          xl:text-[15px] xl:pb-5 xl:pt-0
                          2xl:text-[15px] 2xl:pb-5 2xl:pt-0">
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
      </div>
      <aside className="sticky top-0 self-start h-screen hidden
      sm:hidden
      md:hidden
      lg:hidden
      xl:block
      2xl:block">
        <section className="flex items-center justify-end">
          <img src={config_detail} alt="login imagem" className=" h-screen" />
        </section>
      </aside>
    </div>
  )
}