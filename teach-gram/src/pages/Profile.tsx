import logo from "../assets/logo.png";
import back_button from "../assets/backButton.png";

import feed_button from "../assets/feed-button.png";
import create_post_button from "../assets/create-post-button.png";
import friends_button from "../assets/friends-button.png";
import configuration_button from "../assets/configuration-button.png";
import no_profile from "../assets/no-profile.png";
import close_button from "../assets/close-button.png";

import { useContext, useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

import { Modal } from "./ModalPages/Modal";
import { getLogedUser } from "../services/user.service";
import { AuthContext } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { createPost } from "../services/post.service";

export function Profile() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isFriendsModalOpen, setFriendsModalOpen] = useState(false);
    const [isConfirmedPhoto, setIsConfirmedPhoto] = useState(false);
    const [isConfirmingPhoto, setIsConfirmingPhoto] = useState(false);
    const [msg, setMsg] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [mediaInput, setMediaInput] = useState('');

    const navigate = useNavigate();

    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useUser();

    const [userInfo, setUserInfo] = useState({
        profileLink: '',
        name: '',
        username: '',
        description: ''
    })

    useEffect(() => {
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

                setUserInfo(user);

            } catch (error) {
                console.error("Erro ao fazer ao pegar as informações do usuário:", error);
            }
        }
        handleLogedUser();
    }, [])

    const [postInfo, setPostInfo] = useState({
        title: '',
        description: '',
        photoLink: '',
        videoLink: '',
        privatePost: false
    })

    const isValidImage = (url: string) => /\.(png|jpg|jpeg)$/i.test(url)

    const isYouTubeLink = (url: string) =>
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url)

    const getYouTubeThumbnail = (url: string): string | null => {
        const regex = /(?:youtube\.com.*(?:v=|\/embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
    }

    const handleCloseModalBtn = () => {
        setIsConfirmingPhoto(false);
    }

    useEffect(() => {
        if (imageUrl.startsWith("http")) {
            setIsConfirmingPhoto(true);
        } else {
            setIsConfirmingPhoto(false);
        }
    }, [imageUrl])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostInfo((prev) => ({ ...prev, [name]: value }));
    }

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;

        setMediaInput(value);
        setImageUrl(value);

        if (isValidImage(value)) {
            setPostInfo((prev) => ({
                ...prev,
                photoLink: value,
                videoLink: ''
            }));
        } else if (isYouTubeLink(value)) {
            const thumbnail = getYouTubeThumbnail(value);
            if (thumbnail) {
                setPostInfo((prev) => ({
                    ...prev,
                    photoLink: thumbnail,
                    videoLink: value
                }));
                setImageUrl(thumbnail);
            } else {
                setImageUrl('');
            }
        } else {
            setPostInfo((prev) => ({
                ...prev,
                photoLink: '',
                videoLink: ''
            }));
        }
    }

    const handleRegisterPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createPost(postInfo);

            setIsConfirmingPhoto(false);
            setModalOpen(false);
            setIsConfirmedPhoto(false);
            window.location.reload();

        } catch (error: any) {
            const msg = error.response?.data?.message;
            setMsg(msg);
        }
    }

    return (
        <div className="grid grid-cols-[25vw_75vw] h-screen">
            <section className="flex justify-center items-center">
                <div className="grid grid-rows-[15vh_85vh] w-[80%]">
                    <section className="flex flex-row gap-5 items-center">
                        <button type="button" className="cursor-pointer"
                            onClick={() => {
                                setIsAuthenticated(false)
                                navigate("../")
                            }}>
                            <img src={back_button} alt="Voltar" className="h-[3vh]" />
                        </button>
                        <img className="h-[4vh]" src={logo} alt="logo imagem" />
                    </section>

                    <section className="flex flex-col mt-8 items-center gap-8">
                        <Link
                            to="Feed"
                            className="grid grid-cols-[35%_65%] items-center cursor-pointer border border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline">
                            <div className="flex justify-center">
                                <img src={feed_button} alt="Feed" className="h-[3vh]" />
                            </div>
                            <div className="flex justify-start">
                                <h1 className="text-[20px] font-normal text-[#8E8E8E]">Feed</h1>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setFriendsModalOpen(true)}
                            className="grid grid-cols-[35%_65%] items-center cursor-pointer border border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline">
                            <div className="flex justify-center">
                                <img src={friends_button} alt="Amigos" className="h-[3vh]" />
                            </div>
                            <div className="flex justify-start">
                                <h1 className="text-[20px] font-normal text-[#8E8E8E]">Friends</h1>
                            </div>
                        </button>

                        <Link
                            to="Profilesec"
                            className="grid grid-cols-[35%_65%] items-center cursor-pointer border border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline">
                            <div className="flex justify-center">
                                <img src={userInfo.profileLink || no_profile} alt="Perfil" className="rounded-full object-cover aspect-square w-12 h-12" />
                            </div>
                            <div className="flex justify-start">
                                <h1 className="text-[20px] font-normal text-[#8E8E8E]">Perfil</h1>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={() => navigate("../Settings/Menu")}
                            className="grid grid-cols-[35%_65%] items-center cursor-pointer border border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline">
                            <div className="flex justify-center">
                                <img src={configuration_button} alt="Settings" className="h-[3vh]" />
                            </div>
                            <div className="flex justify-start">
                                <h1 className="text-[20px] font-normal text-[#8E8E8E]">Configurações</h1>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="grid grid-cols-[35%_65%] items-center cursor-pointer border border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline">
                            <div className="flex justify-center">
                                <img src={create_post_button} alt="Create" className="h-[3vh]" />
                            </div>
                            <div className="flex justify-start">
                                <h1 className="text-[20px] font-normal text-[#8E8E8E]">Criar</h1>
                            </div>
                        </button>
                    </section>
                </div>
            </section>
            <section className="overflow-y-auto">
                <div className="h-auto">
                    <Modal isOpen={isFriendsModalOpen} onClose={() => setFriendsModalOpen(false)}>
                        <section className="bg-white rounded-[30px] shadow-lg z-60 w-[528px] flex justify-center items-center">
                            <div className="w-full h-full flex flex-col p-5">
                                <button
                                    onClick={() => setIsConfirmedPhoto(false)}
                                    className="flex cursor-pointer">
                                    <img src={back_button} alt="botão de fechar modal"
                                        className="w-[18px] h-[18px]" />
                                </button>

                            </div>
                        </section>
                    </Modal>

                    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                        {isConfirmedPhoto ? (
                            <section className="bg-white rounded-[30px] shadow-lg z-60 w-[528px] flex justify-center items-center">
                                <div className="w-full h-full flex flex-col p-5">
                                    <button
                                        onClick={() => setIsConfirmedPhoto(false)}
                                        className="flex cursor-pointer">
                                        <img src={back_button} alt="botão de fechar modal"
                                            className="w-[18px] h-[18px]" />
                                    </button>

                                    <form onSubmit={handleRegisterPost} className="flex flex-col px-7 gap-5">
                                        <div className="flex flex-row items-center justify-between">
                                            <h1 className="text-[25px] font-semibold text-[#303030]">Criar nova publicação</h1>
                                            <button type="submit"
                                                className="flex cursor-pointer">
                                                <p className="text-[#F37671] hover:underline">Compartilhar</p>
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <img src={imageUrl}
                                                alt="Imagem inserida"
                                                className="h-90 w-full object-cover aspect-square rounded-2xl pb-2" />

                                            <div className="flex flex-col w-full max-w-xs">
                                                <label htmlFor="title" className="text-[15px] text-[#8E8E8E]">Título</label>
                                                <input id="title" name="title" value={postInfo.title} onChange={handleChange}
                                                    type="text"
                                                    className="px-1 w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                                                />
                                            </div>

                                            <div className="flex flex-col w-full max-w-xs">
                                                <label htmlFor="description" className="text-[15px] text-[#8E8E8E]">Descrição</label>
                                                <input id="description" name="description" value={postInfo.description} onChange={handleChange}

                                                    type="text"
                                                    className="px-1 w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                                                />
                                            </div>

                                            <label className="flex items-center gap-1 text-[15px] text-[#8E8E8E] cursor-pointer pb-5">
                                                <input type="checkbox"
                                                    checked={postInfo.privatePost}
                                                    onChange={(e) =>
                                                        setPostInfo((prev) => ({ ...prev, privatePost: e.target.checked }))
                                                    }
                                                    className="accent-[#F37671] cursor-pointer" /> Post Privado
                                            </label>
                                        </div>
                                    </form>

                                </div>
                            </section>
                        ) : (
                            <section>
                                {isConfirmingPhoto ? (
                                    <section className="bg-white rounded-[30px] shadow-lg z-60 w-[528px] flex justify-center items-center">
                                        <div className="w-full h-full flex flex-col p-5">
                                            <button
                                                onClick={handleCloseModalBtn}
                                                className="flex cursor-pointer">
                                                <img src={close_button} alt="botão de fechar modal"
                                                    className="w-[18px] h-[18px]" />
                                            </button>
                                            <div className="flex flex-col px-7 gap-5">
                                                <div className="flex flex-row items-center justify-between">
                                                    <h1 className="text-[25px] font-semibold text-[#303030]">Criar nova publicação</h1>
                                                    <button
                                                        onClick={() => setIsConfirmedPhoto(true)}
                                                        className="flex cursor-pointer">
                                                        <p className="text-[#F37671] hover:underline">Avançar</p>
                                                    </button>
                                                </div>
                                                <img src={imageUrl}
                                                    alt="Imagem inserida"
                                                    className="h-100 w-full object-cover mb-4 aspect-square pb-2 rounded-2xl" />
                                            </div>
                                        </div>
                                    </section>
                                ) : (<section className="bg-white rounded-[30px] shadow-lg z-60 w-[512px]">
                                    <div className="flex items-center justify-center">
                                        <div className="mt-8 w-[80%] flex justify-between">
                                            <h2 className="text-[24px] font-semibold mb-4 text-[#303030]">Criar nova publicação</h2>
                                            <button
                                                onClick={() => setModalOpen(false)}
                                                className="flex cursor-pointer">
                                                <img src={close_button} alt="botão de fechar modal"
                                                    className="w-[15px] h-[15px]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="flex flex-col w-[80%] pt-8 pb-12">
                                            <div className="flex justify-center">
                                                <div className="h-8 flex justify-center items-center rounded-[8px] text-[15px] bg-[#F37671] text-white w-[32%] relative z-10">
                                                    <p>Link da Imagem</p>
                                                </div>
                                                <div className="-translate-x-3">
                                                    <input id="media" name="media"
                                                        type="url"
                                                        value={mediaInput}
                                                        onChange={handleMediaChange}
                                                        placeholder="Insira aqui a url da imagem"
                                                        className="truncate h-8 p-1.5 pl-6 border border-[#B5B5B5] rounded-[8px] text-sm text-[#303030] text-[15px] focus:outline-none focus:border focus:border-[#F37671]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                )}
                            </section>
                        )}
                    </Modal>

                    <Outlet />
                </div>
            </section>
        </div >
    )
}