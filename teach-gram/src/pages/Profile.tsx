import logo from "../assets/logo.png";
import back_button from "../assets/backButton.png";

import feed_button from "../assets/feed-button.png";
import create_post_button from "../assets/create-post-button.png";
import friends_button from "../assets/friends-button.png";
import configuration_button from "../assets/configuration-button.png";
import no_profile from "../assets/no-profile.png";
import close_button from "../assets/close-button.png";
import gray_arrow from "../assets/gray-arrow.png";

import { useContext, useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

import { Modal } from "./ModalPages/Modal";
import { getLogedUser, getMyFriends } from "../services/user.service";
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
    const [friends, setFriends] = useState<Friend[]>([]);

    const isDesktop = useMediaQuery({ minWidth: 1280 });

    //Friends Carrossel
    const [currentPage, setCurrentPage] = useState(1);
    const friendsPerPage = 4;

    const totalPages = Math.ceil(friends.length / friendsPerPage);
    const startIndex = (currentPage - 1) * friendsPerPage;
    const currentFriends = friends.slice(startIndex, startIndex + friendsPerPage);

    const navigate = useNavigate();

    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useUser();

    const [userInfo, setUserInfo] = useState({
        profileLink: '',
        name: '',
        username: '',
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

    const loadFriends = async () => {
        try {
            const data = await getMyFriends();
            setFriends(data);

        } catch (error) {
            console.error('Erro ao buscar amigos:', error);
        }
    };

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


        loadFriends();
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
        console.log('Digitando:', name, value);
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
        try {
            e.preventDefault();
            await createPost(postInfo);

            setIsConfirmingPhoto(false);
            setModalOpen(false);
            setIsConfirmedPhoto(false);

        } catch (error: any) {
            const msg = error.response?.data?.message;
            setMsg(msg);
        }
    }

    const Logo = () =>
        <div className="h-20 flex w-full items-center px-20
        sm:px-15 sm:h-20
        md:px-20 md:h-20
        lg:px-20 lg:h-20
        xl:px-0 xl:h-20
        2xl:px-0 2xl:h-20">
            <img className="h-[5vh]
            sm:h-[4vh]
            md:h-[5vh]
            lg:h-[5vh]
            xl:h-[5vh]
            2xl:h-[5vh]" src={logo} alt="logo imagem" />
        </div>

    // MENU
    const Menu = () =>
        <div className="grid grid-rows-[100%] w-[80%] 
        sm:grid-rows-[100%] sm:w-[100%]
        md:grid-rows-[100%] md:w-[100%]
        lg:grid-rows-[100%] lg:w-[100%]
        xl:grid-rows-[10vh_85vh] xl:w-[80%]
        2xl:grid-rows-[15vh_85vh] 2xl:w-[80%]">
            <section className="hidden flex-row gap-5 items-center
            sm:hidden
            md:hidden
            lg:hidden
            xl:flex
            2xl:flex">
                <button type="button" className="cursor-pointer"
                    onClick={() => {
                        setIsAuthenticated(false)
                        navigate("../")
                    }}>
                    <img src={back_button} alt="Voltar" className="h-[3vh]" />
                </button>
                <Logo />
            </section>

            <section className="grid flex-col mt-0 items-center gap-0
            sm:grid sm:grid-cols-5 sm:mt-0 sm:gap-0
            md:grid md:grid-cols-5 md:mt-0 md:gap-0
            lg:grid lg:grid-cols-5 lg:mt-0 lg:gap-0
            xl:flex-col xl:flex xl:mt-8 xl:gap-8
            2xl:flex-col 2xl:flex 2xl:mt-8 2xl:gap-8">
                <Link
                    to="Feed"
                    className="grid grid-cols-[35%_65%] items-center cursor-pointer border-1 border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={feed_button} alt="Feed" className="h-8
                        sm:h-6
                        md:h-8
                        lg:h-8
                        xl:h-[3vh]
                        2xl:h-[3vh]" />
                    </div>
                    <div className="flex justify-start
                    sm:hidden
                    md:hidden
                    lg:hidden
                    xl:flex
                    2xl:flex">
                        <h1 className="text-[20px] font-normal text-[#8E8E8E]
                        sm:text-[20px]
                        md:text-[20px]
                        lg:text-[20px]
                        xl:text-[18px]
                        2xl:text-[20px]">Feed</h1>
                    </div>
                </Link>

                <button
                    type="button"
                    onClick={() => {
                        loadFriends();
                        setFriendsModalOpen(true);
                    }}
                    className="grid grid-cols-[100%] items-center cursor-pointer border-1 border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={friends_button} alt="Amigos" className="h-8
                        sm:h-6
                        md:h-8
                        lg:h-8
                        xl:h-[3vh]
                        2xl:h-[3vh]" />
                    </div>
                    <div className="flex justify-start
                    sm:hidden
                    md:hidden
                    lg:hidden
                    xl:flex
                    2xl:flex">
                        <h1 className="text-[20px] font-normal text-[#8E8E8E]
                        sm:text-[20px]
                        md:text-[20px]
                        lg:text-[20px]
                        xl:text-[18px]
                        2xl:text-[20px]">Amigos</h1>
                    </div>
                </button>

                <Link
                    to="Profilesec"
                    className="grid grid-cols-[100%] items-center cursor-pointer border-1 border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={userInfo.profileLink || no_profile} alt="Perfil" className="rounded-full object-cover aspect-square w-10 h-10
                        sm:w-10 sm:h-10
                        md:w-10 md:h-10
                        lg:w-10 lg:h-10
                        xl:w-9 xl:h-9
                        2xl:w-12 2xl:h-12" />
                    </div>
                    <div className="flex justify-start
                    sm:hidden
                    md:hidden
                    lg:hidden
                    xl:flex
                    2xl:flex">
                        <h1 className="text-[20px] font-normal text-[#8E8E8E]
                        sm:text-[20px]
                        md:text-[20px]
                        lg:text-[20px]
                        xl:text-[18px]
                        2xl:text-[20px]">Perfil</h1>
                    </div>
                </Link>

                <button
                    type="button"
                    onClick={() => navigate("../Settings/Menu")}
                    className="grid grid-cols-[100%] items-center cursor-pointer border-1 border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={configuration_button} alt="Settings" className="h-8
                        sm:h-6
                        md:h-8
                        lg:h-8
                        xl:h-[3vh]
                        2xl:h-[3vh]" />
                    </div>
                    <div className="flex justify-start
                    sm:hidden
                    md:hidden
                    lg:hidden
                    xl:flex
                    2xl:flex">
                        <h1 className="text-[20px] font-normal text-[#8E8E8E]
                        sm:text-[20px]
                        md:text-[20px]
                        lg:text-[20px]
                        xl:text-[18px]
                        2xl:text-[20px]">Configurações</h1>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="grid grid-cols-[100%] items-center cursor-pointer border-1 border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={create_post_button} alt="Create" className="h-8
                        sm:h-6
                        md:h-8
                        lg:h-8
                        xl:h-[3vh]
                        2xl:h-[3vh]" />
                    </div>
                    <div className="flex justify-start
                    sm:hidden
                    md:hidden
                    lg:hidden
                    xl:flex
                    2xl:flex">
                        <h1 className="text-[20px] font-normal text-[#8E8E8E]
                        sm:text-[20px]
                        md:text-[20px]
                        lg:text-[20px]
                        xl:text-[18px]
                        2xl:text-[20px]">Criar</h1>
                    </div>
                </button>
            </section>
        </div>;

    // PAGINA
    const Pagina = () => <div className="h-auto flex justify-center
    sm:flex sm:justify-center
    md:flex md:justify-center
    lg:flex lg:justify-center
    xl:block xl:justify-start
    2xl:block 2xl:justify-start">

        <Outlet />

        {/* Friends Section */}
        <Modal isOpen={isFriendsModalOpen} onClose={() => setFriendsModalOpen(false)}>
            <section className="bg-white rounded-[30px] shadow-lg z-60 w-[528px] flex flex-col justify-center items-center p-10">
                <div className="w-full flex justify-end">
                    <button type="button"
                        onClick={() => {
                            setFriendsModalOpen(false)
                        }}
                        className="flex cursor-pointer">
                        <img src={close_button} alt="botão de fechar modal"
                            className="w-[18px] h-[18px]" />
                    </button>
                </div>
                <div className="w-full flex justify-start py-3 border-b-2 border-[#CECECE]">
                    <h1 className="text-[25px] font-semibold text-[#303030]">Amigos</h1>
                </div>
                <div className="w-full p-5 pt-8 flex flex-col gap-6">
                    {currentFriends.map(friend => (
                        <div key={friend.id}
                            className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <img src={friend.profileLink}
                                    className="rounded-full object-cover aspect-square w-15 h-15"
                                    alt="foto de perfil" />
                                <div>
                                    <h1 className="capitalize text-[20px] font-semibold text-[#303030] break-words">{friend.username}</h1>
                                    <div className="capitalize text-[15px] text-[#A09F9F] font-semibold w-full h-fit break-words">{friend.name}</div>
                                </div>
                            </div>
                            <button type="button"
                                onClick={() => {
                                    setFriendsModalOpen(false)
                                    navigate(`/Profile/profilesec/${friend.id}`)
                                }}
                                className="h-fit bg-[#F37671] text-white rounded-[8px] text-[15px] cursor-pointer p-1 px-2 font-light
                                hover:bg-white hover:text-[#F37671] hover:border-1">
                                Ver Perfil
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-3 mt-8">
                    <button type="button"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                        className="border-1 border-[#C4C4C4] w-7 h-7 flex items-center justify-center rounded-[6px] cursor-pointer
                        hover:bg-[#F37671] hover:border-none">
                        <img className="w-3"
                            src={gray_arrow} alt="flecha" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button type="button"
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`border-1 border-[#C4C4C4] text-[#C4C4C4] w-7 h-7 flex items-center justify-center rounded-[6px] cursor-pointer ${currentPage === page ?
                                "bg-[#F37671] text-white border-[#F37671]" :
                                "text-[#C4C4C4] hover:bg-[#F37671] hover:text-white"}`}>
                            {page}
                        </button>
                    ))}
                    <button type="button"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                        className="border-1 border-[#C4C4C4] w-7 h-7 flex items-center justify-center rounded-[6px] rotate-180 cursor-pointer
                        hover:bg-[#F37671] hover:border-none">
                        <img className="w-3"
                            src={gray_arrow} alt="flecha" />
                    </button>
                </div>
            </section>
        </Modal>

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            {isConfirmedPhoto ? (
                <section className="bg-white rounded-[30px] shadow-lg z-60 w-[528px] flex justify-center items-center">
                    <div className="w-full h-full flex flex-col p-5">
                        <button type="button"
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
                                        className="px-1 w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]" />
                                </div>

                                <div className="flex flex-col w-full max-w-xs">
                                    <label htmlFor="description" className="text-[15px] text-[#8E8E8E]">Descrição</label>
                                    <input id="description" name="description" value={postInfo.description} onChange={handleChange}
                                        type="text"
                                        className="px-1 w-100 truncate border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]" />
                                </div>

                                <label className="flex items-center gap-1 text-[15px] text-[#8E8E8E] cursor-pointer pb-5">
                                    <input type="checkbox"
                                        checked={postInfo.privatePost}
                                        onChange={(e) => {
                                            setPostInfo((prev) => ({ ...prev, privatePost: e.target.checked }))
                                        }}
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
                                <button type="button"
                                    onClick={handleCloseModalBtn}
                                    className="flex cursor-pointer">
                                    <img src={close_button} alt="botão de fechar modal"
                                        className="w-[18px] h-[18px]" />
                                </button>
                                <div className="flex flex-col px-7 gap-5">
                                    <div className="flex flex-row items-center justify-between">
                                        <h1 className="text-[25px] font-semibold text-[#303030]">Criar nova publicação</h1>
                                        <button type="button"
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
                                <button type="button"
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
    </div>;


    return (
        <div className="h-screen">
            {isDesktop ? (
                <div className="grid grid-cols-[25vw_75vw]">
                    <section className="flex justify-center items-center">
                        <Menu />
                    </section>
                    <section className="overflow-y-auto">
                        <Pagina />
                    </section>
                </div>
            ) : (
                <div className="grid grid-rows-[auto_1fr_auto] h-full">
                    <section className="flex justify-center items-center shadow-[0_0_7px_rgba(0,0,0,0.2)]">
                        <Logo />
                    </section>
                    <section className="overflow-y-auto">
                        <Pagina />
                    </section>
                    <section className="flex justify-center items-center shadow-[0_0_7px_rgba(0,0,0,0.2)]">
                        <Menu />
                    </section>
                </div>
            )}
        </div>
    )
}