import no_profile from "../../assets/no-profile.png";
import close_button from "../../assets/close-button.png";

import { useState, useEffect } from "react";

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { Modal } from "../ModalPages/Modal";

import { getLogedUser, getMyFriends } from "../../services/user.service";
import { getAllMyPosts, editPost, getMyPostById, deletePost, patchPostLikes } from "../../services/post.service";
import post_hamburguer from "../../assets/post-hamburguer.png";
import like_button from "../../assets/like-button.png";

export function ProfileSec() {
  const [status, setStatus] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

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

  type Post = {
    id: number;
    title: string;
    description: string;
    photoLink: string;
    videoLink: string;
    privatePost: boolean;
    createdAt: string;
    likes: number;
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

  useEffect(() => {
    const handleLogedUser = async () => {
      setStatus(true);
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
        setStatus(false);
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
    };
    handlePosts()

    const loadFriends = async () => {
      try {
        const data = await getMyFriends();
        setFriends(data);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    };
    loadFriends();
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
    }));
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
      });
      setEditModalOpen(postId);
    } catch (error) {
      console.error("Erro ao carregar post:", error);
    }
  }

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

  const convertToEmbed = (url: string) => {
    const regex = /watch\?v=([\w-]+)/;
    const match = url.match(regex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  return (
    <div className="w-[1000px]">
      {status ? (
        <LoadingSpinnerSmall />
      ) : (
        <div className="grid grid-rows-[auto_auto] justify-center w-full
        sm:w-full
        md:w-full
        lg:w-full
        xl:w-[80%]
        2xl:w-full">
          <section className="flex py-[60px] gap-20 w-full max-w-screen-lg mx-auto">
            <img className="rounded-full object-cover aspect-square w-70 h-70
            sm:w-70 sm:h-70
            md:w-70 md:h-70
            lg:w-70 lg:h-70
            xl:w-60 xl:h-60
            2xl:w-70 2xl:h-70"
              src={user.profileLink || no_profile}
              alt="foto de perfil" />

            <div className="flex flex-col pt-10 gap-4 max-w-[580px]">
              <h1 className="capitalize text-[25px] font-semibold text-[#303030] break-words">{user.name}</h1>
              <div className="text-[20px] text-[#6b6b6b] font-light w-full h-fit break-words">{user.description}</div>
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
                      <div className="h-fit w-[550px] bg-white rounded-[18px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.2)] flex flex-col items-end">
                        {activePostId === post.id && (
                          <div className="-translate-x-5 absolute w-24 bg-white border border-[#E2E2E2] shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[8px] z-10 flex flex-col items-center justify-center">
                            <button
                              className="flex justify-center w-full px-4 pb-1 pt-2 text-left hover:bg-gray-100"
                              onClick={() => {
                                setModalOpen(null);
                                setIsModalOpen(false);
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
                          <button onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                            className="cursor-pointer w-4 flex justify-center">
                            <img className="h-7"
                              src={post_hamburguer}
                              alt="hamburguer" />
                          </button>
                        </div>
                        <div className="flex flex-col mt-5 gap-5 w-full">
                          <div className="flex flex-col gap-1">
                            <div className="text-[20px] text-[#4d4d4d] font-semibold w-full max-w-[480px] h-fit break-words">{post.title}</div>
                            <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words">{post.description}</div>
                          </div>

                          {post.videoLink ? (
                            <iframe
                              className="w-full h-[320px] rounded-[8px]"
                              src={convertToEmbed(post.videoLink)}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <img
                              className="object-cover w-full h-full max-h-[500px] cursor-pointer rounded-[8px]"
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

          <section className="flex flex-col items-center gap-5">
            <div className="flex">
              <div className="flex flex-col items-center">
                <h1 className="capitalize text-[20px] font-semibold text-[#303030]">{posts.length}</h1>
                <p className="text-[20px] text-[#6b6b6b] font-light">Posts</p>
              </div>

              <div className="mt-1 w-[1px] h-10 bg-[#DBDADA] mx-10"></div>

              <div className="flex flex-col items-center">
                <h1 className="capitalize text-[20px] font-semibold text-[#303030]">{friends.length}</h1>
                <p className="text-[20px] text-[#6b6b6b] font-light">Amigos</p>
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