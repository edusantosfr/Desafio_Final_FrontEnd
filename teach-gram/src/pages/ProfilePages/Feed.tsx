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

// import { Post } from "../Post";

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
              <div className="h-fit w-[550px] bg-white rounded-[18px] p-8 shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col items-end relative z-0" >
                <div className="flex h-fit w-full justify-between items-start">
                  <section className="flex gap-8 w-full max-w-screen-lg mx-auto items-center">
                    <img className="rounded-full object-cover aspect-square w-22 h-22 cursor-pointer"
                      src={post.user.profileLink}
                      alt="foto de perfil"
                      onClick={() => post.user.id === Number(userId) ? navigate('/Profile/profilesec') : navigate(`/Profile/profilesec/${post.user.id}`)} />

                    <div className="flex flex-col max-w-[650px]">
                      <h1 onClick={() => post.user.id === Number(userId) ? navigate('/Profile/profilesec') : navigate(`/Profile/profilesec/${post.user.id}`)}
                        className="capitalize text-[25px] font-light text-[#8E8E8E] break-words cursor-pointer">{post.user.username}</h1>

                      <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[340px] h-fit break-words">{tempoFormatado}</div>
                    </div>
                  </section>
                  <div className="relative z-0">
                    {activePostId === post.id && (
                      <div className="absolute -translate-x-25 w-24 bg-white border border-[#E2E2E2] shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[8px] flex flex-col items-center justify-center">
                        <button
                          className="flex justify-center w-full px-4 pb-1 pt-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setIsEditPostModalOpen(true);
                            handleOpenEditModal(post.id);
                          }}>
                          <p className="text-[15px] text-[#F37671] font-medium">Editar</p>
                        </button>
                        <button
                          className="flex justify-center w-full px-4 pb-2 pt-1 text-left hover:bg-gray-100"
                          onClick={() => {
                            setIsDeletePostModalOpen(true);
                            setDeleteModalOpen(post.id);
                          }}>
                          <p className="text-[15px] text-[#F37671] font-medium">Excluir</p>
                        </button>
                      </div>
                    )}
                    {post.user.id === Number(userId) && (
                      <button onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                        className="cursor-pointer w-4 flex justify-center">
                        <img className="h-7"
                          src={post_hamburguer}
                          alt="hamburguer" />
                      </button>
                    )}
                  </div>

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

              {deleteModalOpen === post.id && (
                <Modal isOpen={isDeletePostModalOpen} onClose={() => setIsDeletePostModalOpen(false)}>
                  <div className="bg-white rounded-[30px] shadow-lg z-60 max-w-lg w-fit h-fit flex flex-col items-center p-12 gap-8">
                    <h2 className="text-[24px] font-semibold text-[#303030]">Excluir Publicação?</h2>
                    <div className="flex items-center justify-center">
                      <div className="flex flex-col w-[80%] gap-10">
                        <div className="flex justify-center gap-12">
                          <button
                            onClick={() => setIsDeletePostModalOpen(false)}
                            className="px-10 py-0.5 rounded-[8px] text-[15px] border-[#F37671] border-1 text-[#F37671] cursor-pointer">
                            Cancelar
                          </button>
                          <button
                            onClick={() => handlePostDelete(post.id)}
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
                  <section className="bg-white rounded-[30px] shadow-lg z-60 w-[528px] flex justify-center items-center">
                    <div className="w-full h-full flex flex-col p-7">
                      <button
                        onClick={() => setIsEditPostModalOpen(false)}
                        className="flex cursor-pointer">
                        <img src={close_button} alt="botão de fechar modal"
                          className="w-[18px] h-[18px]" />
                      </button>

                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handlePostEdit(post.id);
                      }}
                        className="flex flex-col px-7 gap-5">
                        <div className="flex flex-row items-center justify-between">
                          <h1 className="text-[25px] font-semibold text-[#303030]">Editar publicação</h1>
                          <button type="submit"
                            className="flex cursor-pointer">
                            <p className="text-[#F37671] hover:underline">Salvar</p>
                          </button>
                        </div>
                        <div className="flex flex-col gap-3">
                          <img src={editPostData.photoLink}
                            alt="Imagem inserida"
                            className="h-90 w-full object-cover aspect-square rounded-2xl pb-2" />

                          <div className="flex flex-col w-full max-w-xs">
                            <label htmlFor="photoLink" className="text-[15px] text-[#8E8E8E]">Link da Foto</label>
                            <input id="photoLink" name="photoLink" type="url" value={editPostData.photoLink} onChange={handleChange}
                              className="px-1 w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]" />
                          </div>

                          <div className="flex flex-col w-full max-w-xs">
                            <label htmlFor="title" className="text-[15px] text-[#8E8E8E]">Título</label>
                            <input id="title" name="title" value={editPostData.title} onChange={handleChange}
                              type="text"
                              className="px-1 w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]" />
                          </div>

                          <div className="flex flex-col w-full max-w-xs">
                            <label htmlFor="description" className="text-[15px] text-[#8E8E8E]">Descrição</label>
                            <input id="description" name="description" value={editPostData.description} onChange={handleChange}

                              type="text"
                              className="px-1 w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]" />
                          </div>

                          <div className="flex flex-col w-full max-w-xs">
                            <label htmlFor="videoLink" className="text-[15px] text-[#8E8E8E]">Link do Vídeo 'Opcional'</label>
                            <input id="videoLink" name="videoLink" value={editPostData.videoLink} onChange={handleChange}
                              type="url"
                              className="px-1 w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]" />
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

      </div>
      <aside className="sticky top-0 self-start h-screen">
        <section className="flex items-center justify-end">
          <img src={config_detail} alt="login imagem" className=" h-screen" />
        </section>
      </aside>
    </div>
  )
}