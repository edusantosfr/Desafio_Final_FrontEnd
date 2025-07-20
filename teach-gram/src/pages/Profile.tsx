import logo from "../assets/logo.png";
import back_button from "../assets/backButton.png";
import feed_button from "../assets/feed-button.png";
import create_post_button from "../assets/create-post-button.png";
import friends_button from "../assets/friends-button.png";
import configuration_button from "../assets/configuration-button.png";
import no_profile from "../assets/no-profile.png";
import close_button from "../assets/close-button.png";
import gray_arrow from "../assets/gray-arrow.png";
import loading_logo from "../assets/loading-logo.png";

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
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [mediaInput, setMediaInput] = useState('');
    const [friends, setFriends] = useState<Friend[]>([]);

    const isDesktop = useMediaQuery({ minWidth: 1280 });

    //Friends Carrossel
    const [currentPage, setCurrentPage] = useState(1);
    const [friendsPerPage, setFriendsPerPage] = useState(4);

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

        const updateFriendsPage = () => {
            const width = window.innerWidth;

            if (width < 640) {
                setFriendsPerPage(8);
            } else {
                setFriendsPerPage(4);
            }
        }

        updateFriendsPage();

        window.addEventListener('resize', updateFriendsPage);
        return () => window.removeEventListener('resize', updateFriendsPage);
    }, [])

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

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;

        setMediaInput(value);
        setImageUrl(value);

        if (isValidImage(value)) {
            setImageUrl(value);
        } else if (isYouTubeLink(value)) {
            setVideoUrl(value);
            const thumbnail = getYouTubeThumbnail(value);
            if (thumbnail) {
                setImageUrl(thumbnail);
            } else {
                setImageUrl('');
            }
        }
    }

    const handleRegisterPost = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);

            const postInfo = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                photoLink: imageUrl,
                videoLink: videoUrl,
                privatePost: formData.get("privatePost") === "on"
            }

            await createPost(postInfo);

            setIsConfirmingPhoto(false);
            setModalOpen(false);
            setIsConfirmedPhoto(false);

        } catch (error: any) {
            console.log(error)
        }
    }

    //LOGO
    const Logo = () =>
        <div className="h-15 flex w-full items-center px-10
        sm:px-15 sm:h-20
        md:px-20 md:h-20
        lg:px-20 lg:h-20
        xl:px-0 xl:h-20
        2xl:px-0 2xl:h-20">
            <img className="h-[3.5vh]
            sm:h-[4vh]
            md:h-[5vh]
            lg:h-[5vh]
            xl:h-[5vh]
            2xl:h-[5vh]" src={logo} alt="logo imagem" />
        </div>

    // MENU
    const Menu = () =>
        <div className="grid grid-rows-[100%] w-[100%]
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
                        setIsAuthenticated(false);
                        navigate("../");
                    }}>
                    <img src={back_button} alt="Voltar" className="h-[3vh]" />
                </button>
                <Logo />
            </section>

            <section className="grid grid-cols-5  mt-0 items-center gap-0
            sm:grid sm:grid-cols-5 sm:mt-0 sm:gap-0
            md:grid md:grid-cols-5 md:mt-0 md:gap-0
            lg:grid lg:grid-cols-5 lg:mt-0 lg:gap-0
            xl:flex-col xl:flex xl:mt-8 xl:gap-8
            2xl:flex-col 2xl:flex 2xl:mt-8 2xl:gap-8">
                <Link
                    to="Feed"
                    className="grid grid-cols-[100%] items-center cursor-pointer border-0 border-[#E2E2E2] rounded-[15px] h-[9vh] w-full no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={feed_button} alt="Feed" className="h-5
                        sm:h-6
                        md:h-8
                        lg:h-8
                        xl:h-[3vh]
                        2xl:h-[3vh]" />
                    </div>
                    <div className="hidden justify-start
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
                    className="grid grid-cols-[100%] items-center cursor-pointer border-0 border-[#E2E2E2] rounded-[15px] h-[9vh] w-full no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={friends_button} alt="Amigos" className="h-4.5
                        sm:h-5.5
                        md:h-7.5
                        lg:h-7.5
                        xl:h-[3vh]
                        2xl:h-[3vh]" />
                    </div>
                    <div className="hidden justify-start
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
                    className="grid grid-cols-[100%] items-center cursor-pointer border-0 border-[#E2E2E2] rounded-[15px] h-[9vh] w-full no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={userInfo.profileLink || no_profile} alt="Perfil" className="rounded-full object-cover aspect-square w-7 h-7
                        sm:w-10 sm:h-10
                        md:w-10 md:h-10
                        lg:w-10 lg:h-10
                        xl:w-9 xl:h-9
                        2xl:w-12 2xl:h-12" />
                    </div>
                    <div className="hidden justify-start
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
                    className="grid grid-cols-[100%] items-center cursor-pointer border-0 border-[#E2E2E2] rounded-[15px] h-[9vh] w-full no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={configuration_button} alt="Settings" className="h-5
                        sm:h-6
                        md:h-8
                        lg:h-8
                        xl:h-[3vh]
                        2xl:h-[3vh]" />
                    </div>
                    <div className="hidden justify-start
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
                    className="grid grid-cols-[100%] items-center cursor-pointer border-0 border-[#E2E2E2] rounded-[15px] h-[9vh] w-full no-underline
                    sm:w-full sm:grid-cols-[100%] sm:border-0
                    md:w-full md:grid-cols-[100%] md:border-0
                    lg:w-full lg:grid-cols-[100%] lg:border-0
                    xl:w-60 xl:grid-cols-[30%_70%] xl:border-1
                    2xl:w-[15vw] 2xl:grid-cols-[35%_65%] 2xl:border-1">
                    <div className="flex justify-center">
                        <img src={create_post_button} alt="Create" className="h-5
                        sm:h-6
                        md:h-8
                        lg:h-8
                        xl:h-[3vh]
                        2xl:h-[3vh]" />
                    </div>
                    <div className="hidden justify-start
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
            <section className="bg-white shadow-lg z-60 w-screen h-screen flex flex-col justify-start items-center p-5 rounded-[0px]
            sm:w-[528px] sm:p-10 sm:h-fit sm:rounded-[30px] sm:justify-center
            md:w-[528px] md:p-10 md:h-fit md:rounded-[30px] md:justify-center
            lg:w-[528px] lg:p-10 lg:h-fit lg:rounded-[30px] lg:justify-center
            xl:w-[528px] xl:p-10 xl:h-fit xl:rounded-[30px] xl:justify-center
            2xl:w-[528px] 2xl:p-10 2xl:h-fit 2xl:rounded-[30px] 2xl:justify-center">
                <div className="w-full flex justify-between items-start
                sm:justify-end
                md:wjustify-end
                lg:justify-end
                xl:justify-end
                2xl:justify-end">
                    <button type="button"
                        onClick={() => {
                            setFriendsModalOpen(false)
                        }}
                        className="flex cursor-pointer">
                        <img src={close_button} alt="botão de fechar modal"
                            className="w-[12px] h-[12x]
                            sm:w-[18px] sm:h-[18px]
                            md:w-[18px] md:h-[18px]
                            lg:w-[18px] lg:h-[18px]
                            xl:w-[18px] xl:h-[18px]
                            2xl:w-[18px] 2xl:h-[18px]" />
                    </button>
                    <img src={loading_logo}
                        className="w-[35px] h-[35x] flex
                    sm:hidden
                    md:hidden
                    lg:hidden
                    xl:hidden
                    2xl:hidden"
                        alt="" />
                </div>
                <div className="w-full flex justify-start py-2 border-b-1 border-[#CECECE]
                sm:border-b-2 sm:py-3
                md:border-b-2 md:py-3
                lg:border-b-2 lg:py-3
                xl:border-b-2 xl:py-3
                2xl:border-b-2 2xl:py-3">
                    <h1 className="text-[16px] font-semibold text-[#303030]
                    sm:text-[25px] sm:
                    md:text-[25px] md:
                    lg:text-[25px] lg:
                    xl:text-[25px] xl:
                    2xl:text-[25px] 2xl:">Amigos</h1>
                </div>
                <div className="w-full h-full flex flex-col justify-between items-center">
                    <div className="w-full p-0 pt-3 flex flex-col gap-3
                sm:p-5 sm:pt-8 sm:gap-6
                md:p-5 md:pt-8 md:gap-6
                lg:p-5 lg:pt-8 lg:gap-6
                xl:p-5 xl:pt-8 xl:gap-6
                2xl:p-5 2xl:pt-8 2xl:gap-6">
                        {currentFriends.map(friend => (
                            <div key={friend.id}
                                className="flex justify-between items-center">
                                <div className="flex items-center gap-3
                            sm:gap-4
                            md:gap-4
                            lg:gap-4
                            xl:gap-4
                            2xl:gap-4">
                                    <img src={friend.profileLink}
                                        className="rounded-full object-cover aspect-square w-10 h-10
                                    sm:w-15 sm:h-15
                                    md:w-15 md:h-15
                                    lg:hw-15 lg:h-15
                                    xl:hw-15 xl:h-15
                                    2xl:w-15 2xl:h-15"
                                        alt="foto de perfil" />
                                    <div>
                                        <h1 className="capitalize text-[12px] font-medium text-[#303030] break-words
                                    sm:text-[20px] sm:font-semibold
                                    md:text-[20px] md:font-semibold
                                    lg:text-[20px] lg:font-semibold
                                    xl:htext-[20px] xl:font-semibold
                                    2xl:text-[20px] 2xl:font-semibold">{friend.username}</h1>
                                        <div className="capitalize text-[10px] text-[#A09F9F] font-medium w-full h-fit break-words
                                    sm:text-[15px] sm:font-semibold
                                    md:text-[15px] md:font-semibold
                                    lg:text-[15px] lg:font-semibold
                                    xl:text-[15px] xl:font-semibold
                                    2xl:text-[15px] 2xl:font-semibold">{friend.name}</div>
                                    </div>
                                </div>
                                <button type="button"
                                    onClick={() => {
                                        setFriendsModalOpen(false)
                                        navigate(`/Profile/profilesec/${friend.id}`)
                                    }}
                                    className="h-fit bg-[#F37671] text-white rounded-[6px] text-[9px] cursor-pointer p-1 px-1.5 font-light
                                hover:bg-white hover:text-[#F37671] hover:border-1
                                sm:text-[15px] sm:px-2 sm:p-1 sm:rounded-[8px]
                                md:text-[15px] md:px-2 md:p-1 md:rounded-[8px]
                                lg:text-[15px] lg:px-2 lg:p-1 lg:rounded-[8px]
                                xl:text-[15px] xl:px-2 xl:p-1 xl:rounded-[8px]
                                2xl:text-[15px] 2xl:px-2 2xl:p-1 2xl:rounded-[8px]">
                                    Ver Perfil
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-8
                sm:gap-3 sm:
                md:gap-3 md:
                lg:gap-3 lg:
                xl:gap-3 xl:
                2xl:gap-3 2xl:">
                        <button type="button"
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            disabled={currentPage === 1}
                            className="border-1 border-[#C4C4C4] w-6 h-6 flex items-center justify-center rounded-[4px] cursor-pointer
                        hover:bg-[#F37671] hover:border-none
                        sm:w-7 sm:h-7 sm:rounded-[6px]
                        md:w-7 md:h-7 md:rounded-[6px]
                        lg:w-7 lg:h-7 lg:rounded-[6px]
                        xl:w-7 xl:h-7 xl:rounded-[6px]
                        2xl:w-7 2xl:h-7 2xl:rounded-[6px]">
                            <img className="w-2.5
                        sm:w-3
                        md:w-3
                        lg:w-3
                        xl:w-3
                        2xl:w-3"
                                src={gray_arrow} alt="flecha" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button type="button"
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`border-1 border-[#C4C4C4] text-[#C4C4C4] w-6 h-6 flex items-center justify-center rounded-[4px] cursor-pointer ${currentPage === page ?
                                    "bg-[#F37671] text-white border-[#F37671]" :
                                    "text-[#C4C4C4] hover:bg-[#F37671] hover:text-white"}
                                sm:w-7 sm:h-7
                                md:w-7 md:h-7
                                lg:w-7 lg:h-7
                                xl:w-7 xl:h-7
                                2xl:w-7 2xl:h-7`}>
                                {page}
                            </button>
                        ))}
                        <button type="button"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === totalPages}
                            className="border-1 border-[#C4C4C4] w-6 h-6 flex items-center justify-center rounded-[4px] rotate-180 cursor-pointer
                        hover:bg-[#F37671] hover:border-none
                        sm:w-7 sm:h-7 sm:rounded-[6px]
                        md:w-7 md:h-7 md:rounded-[6px]
                        lg:w-7 lg:h-7 lg:rounded-[6px]
                        xl:w-7 xl:h-7 xl:rounded-[6px]
                        2xl:w-7 2xl:h-7 2xl:rounded-[6px]">
                            <img className="w-2.5
                        sm:w-3
                        md:w-3
                        lg:w-3
                        xl:w-3
                        2xl:w-3"
                                src={gray_arrow} alt="flecha" />
                        </button>
                    </div>
                </div>

            </section>
        </Modal>

        <Modal isOpen={isModalOpen} onClose={() => {
            setModalOpen(false)
            setMediaInput('');
            setImageUrl('');
        }}>
            {isConfirmedPhoto ? (
                <section className="bg-white rounded-[20px] shadow-lg z-60 w-[280px] flex justify-center items-center
                sm:w-[528px] sm:rounded-[30px]
                md:w-[528px] md:rounded-[30px]
                lg:w-[528px] lg:rounded-[30px]
                xl:w-[528px] xl:rounded-[30px]
                2xl:w-[528px] 2xl:rounded-[30px]">
                    <div className="w-full h-full flex flex-col p-4
                    sm:p-5
                    md:p-5
                    lg:p-5
                    xl:p-5
                    2xl:p-5">
                        <button type="button"
                            onClick={() => setIsConfirmedPhoto(false)}
                            className="flex cursor-pointer">
                            <img src={back_button} alt="botão de fechar modal"
                                className="w-[12px] h-[12px]
                                sm:w-[18px] sm:h-[18px]
                                md:w-[18px] md:h-[18px]
                                lg:w-[18px] lg:h-[18px]
                                xl:w-[18px] xl:h-[18px] 
                                2xl:w-[18px] 2xl:h-[18px]" />
                        </button>

                        <form onSubmit={handleRegisterPost} className="flex flex-col px-1 gap-2 pt-2
                        sm:px-7 sm:gap-5 sm:pt-0
                        md:px-7 md:gap-5 md:pt-0
                        lg:px-7 lg:gap-5 lg:pt-0
                        xl:px-7 xl:gap-5 xl:pt-0
                        2xl:px-7 2xl:gap-5 2xl:pt-0">
                            <div className="flex flex-row items-center justify-between">
                                <h1 className="text-[13px] font-semibold text-[#303030]
                                sm:text-[25px] 
                                md:text-[25px]
                                lg:text-[25px] 
                                xl:text-[25px]
                                2xl:text-[25px]">Criar nova publicação</h1>
                                <button type="submit"
                                    className="flex cursor-pointer">
                                    <p className="text-[#F37671] hover:underline text-[12px]
                                    sm:text-[16px] sm:
                                    md:text-[16px] md:
                                    lg:text-[16px] lg:
                                    xl:text-[16px] xl:
                                    2xl:text-[16px] 2xl:
                                    ">Compartilhar</p>
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <img src={imageUrl}
                                    alt="Imagem inserida"
                                    className="h-60 w-full object-cover aspect-square rounded-2xl pb-0
                                    sm:h-90 sm:pb-2
                                    md:h-90 md:pb-2
                                    lg:h-90 lg:pb-2
                                    xl:h-90 xl:pb-2
                                    2xl:h-90 2xl:pb-2" />

                                <div className="flex flex-col w-full max-w-xs">
                                    <label htmlFor="title" className="text-[12px] text-[#8E8E8E]
                                    sm:text-[15px]
                                    md:text-[15px]
                                    lg:text-[15px]
                                    xl:text-[15px]
                                    2xl:text-[15px]">Título</label>
                                    <input id="title" name="title"
                                        type="text"
                                        className="px-0 w-60 truncate border-b-1 border-[#E6E6E6] text-[12px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                                        sm:w-100 sm:text-[15px] sm:px-1
                                        md:w-100 md:text-[15px] md:px-1
                                        lg:w-100 lg:text-[15px] lg:px-1
                                        xl:w-100 xl:text-[15px] xl:px-1
                                        2xl:w-100 2xl:text-[15px] 2xl:px-1" />
                                </div>

                                <div className="flex flex-col w-full max-w-xs">
                                    <label htmlFor="description" className="text-[12px] text-[#8E8E8E]
                                    sm:text-[15px]
                                    md:text-[15px]
                                    lg:text-[15px]
                                    xl:text-[15px]
                                    2xl:text-[15px]">Descrição</label>
                                    <input id="description" name="description"
                                        type="text"
                                        className="px-0 w-60 truncate border-b-1 border-[#E6E6E6] text-[12px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                                        sm:w-100 sm:text-[15px] sm:px-1
                                        md:w-100 md:text-[15px] md:px-1
                                        lg:w-100 lg:text-[15px] lg:px-1
                                        xl:w-100 xl:text-[15px] xl:px-1
                                        2xl:w-100 2xl:text-[15px] 2xl:px-1" />
                                </div>

                                <label className="flex items-center gap-1 text-[12px] text-[#8E8E8E] cursor-pointer pb-1
                                sm:text-[15px] sm:pb-5
                                md:text-[15px] md:pb-5
                                lg:text-[15px] lg:pb-5
                                xl:text-[15px] xl:pb-5
                                2xl:text-[15px] 2xl:pb-5">
                                    <input
                                        type="checkbox"
                                        className="accent-[#F37671] cursor-pointer" />
                                    Post Privado
                                </label>
                            </div>
                        </form>

                    </div>
                </section>
            ) : (
                <section>
                    {isConfirmingPhoto ? (
                        <section className="bg-white rounded-[20px] shadow-lg z-60 w-[280px] flex justify-center items-center
                        sm:w-[512px] sm:rounded-[30px]
                        md:w-[512px] md:rounded-[30px]
                        lg:w-[512px] lg:rounded-[30px]
                        xl:w-[512px] xl:rounded-[30px]
                        2xl:w-[512px] 2xl:rounded-[30px]">
                            <div className="w-full h-full flex flex-col p-4
                            sm:p-5
                            md:p-5
                            lg:p-5
                            xl:p-5
                            2xl:p-5">
                                <button type="button"
                                    onClick={handleCloseModalBtn}
                                    className="flex cursor-pointer">
                                    <img src={close_button} alt="botão de fechar modal"
                                        className="w-[12px] h-[12px]
                                        sm:w-[18px] sm:h-[18px]
                                        md:w-[18px] md:h-[18px]
                                        lg:w-[18px] lg:h-[18px]
                                        xl:w-[18px] xl:h-[18px] 
                                        2xl:w-[18px] 2xl:h-[18px]" />
                                </button>
                                <div className="flex flex-col px-2 gap-2 pt-1
                                sm:px-7 sm:gap-5 sm:pt-0
                                md:px-7 md:gap-5 md:pt-0
                                lg:px-7 lg:gap-5 lg:pt-0
                                xl:px-7 xl:gap-5 xl:pt-0
                                2xl:px-7 2xl:gap-5 2xl:pt-0">
                                    <div className="flex flex-row items-center justify-between">
                                        <h1 className="text-[12px] font-semibold text-[#303030]
                                        sm:text-[25px] 
                                        md:text-[25px]
                                        lg:text-[25px] 
                                        xl:text-[25px]
                                        2xl:text-[25px]">Criar nova publicação</h1>
                                        <button type="button"
                                            onClick={() => setIsConfirmedPhoto(true)}
                                            className="flex cursor-pointer">
                                            <p className="text-[#F37671] hover:underline text-[12px]
                                            sm:text-[16px] sm:
                                            md:text-[16px] md:
                                            lg:text-[16px] lg:
                                            xl:text-[16px] xl:
                                            2xl:text-[16px] 2xl:">Avançar</p>
                                        </button>
                                    </div>
                                    <img src={imageUrl}
                                        alt="Imagem inserida"
                                        className="h-60 w-full object-cover mb-0 aspect-square pb-2 rounded-2xl
                                        sm:mb-4 sm:h-100
                                        md:mb-4 md:h-100
                                        lg:mb-4 lg:h-100
                                        xl:mb-4 xl:h-100
                                        2xl:mb-4 2xl:h-100" />
                                </div>
                            </div>
                        </section>
                    ) : (<section className="bg-white rounded-[20px] shadow-lg z-60 w-[280px]
                    sm:w-[512px] sm:rounded-[30px]
                    md:w-[512px] md:rounded-[30px]
                    lg:w-[512px] lg:rounded-[30px]
                    xl:w-[512px] xl:rounded-[30px]
                    2xl:w-[512px] 2xl:rounded-[30px]">
                        <div className="flex items-center justify-center">
                            <div className="mt-4 w-[82%] flex justify-between
                            sm:w-[80%] sm:mt-8
                            md:w-[80%] md:mt-8
                            lg:w-[80%] lg:mt-8
                            xl:w-[80%] xl:mt-8
                            2xl:w-[80%] 2xl:mt-8">
                                <h2 className="text-[17px] font-semibold mb-1 text-[#303030]
                                sm:text-[24px] sm:mb-4
                                md:text-[24px] md:mb-4
                                lg:text-[24px] lg:mb-4
                                xl:text-[24px] xl:mb-4
                                2xl:text-[24px] 2xl:mb-4">Criar nova publicação</h2>
                                <button type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex cursor-pointer">
                                    <img src={close_button} alt="botão de fechar modal"
                                        className="w-[12px] h-[12px] mt-2
                                        sm:w-[15px] sm:h-[15px] sm:mt-0
                                        md:w-[15px] md:h-[15px] md:mt-0
                                        lg:w-[15px] lg:h-[15px] lg:mt-0
                                        xl:w-[15px] xl:h-[15px] xl:mt-0
                                        2xl:w-[15px] 2xl:h-[15px] 2xl:mt-0" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col w-[80%] pt-4 pb-6
                            sm:pb-12 sm:pt-8
                            md:pb-12 md:pt-8
                            lg:pb-12 lg:pt-8
                            xl:pb-12 xl:pt-8
                            2xl:pb-12 2xl:pt-8">
                                <div className="flex justify-center">
                                    <div className="h-8 hidden justify-center items-center rounded-[8px] bg-[#F37671] text-white w-[32%] relative z-10
                                    sm:flex sm:text-[15px]
                                    md:flex md:text-[15px]
                                    lg:flex lg:text-[15px]
                                    xl:flex xl:text-[15px]
                                    2xl:flex 2xl:text-[15px]">
                                        <p>Link da Imagem</p>
                                    </div>
                                    <div className="h-8 flex justify-center items-center rounded-[8px] text-[12px] bg-[#F37671] text-white w-[32%] relative z-10 px-2 translate-x-1.5
                                    sm:hidden sm:text-[15px] sm:
                                    md:hidden md:text-[15px] md:
                                    lg:hidden lg:text-[15px] lg:
                                    xl:hidden xl:text-[15px] xl:
                                    2xl:hidden 2xl:text-[15px] 2xl:">
                                        <p>Link</p>
                                    </div>
                                    <div className="-translate-x-1.5
                                    sm:-translate-x-3 sm:
                                    md:-translate-x-3 md:
                                    lg:-translate-x-3 lg:
                                    xl:-translate-x-3 xl:
                                    2xl:-translate-x-3 2xl:">
                                        <input id="media" name="media"
                                            type="url"
                                            value={mediaInput}
                                            onChange={handleMediaChange}
                                            placeholder="Insira aqui a url da imagem"
                                            className="truncate h-8 p-1.5 pl-5 border border-[#B5B5B5] rounded-[8px] text-sm text-[#303030] text-[12px] focus:outline-none focus:border focus:border-[#F37671]
                                            sm:text-[15px] sm:pl-6 sm:
                                            md:text-[15px] md:pl-6 md:
                                            lg:text-[15px] lg:pl-6 lg:
                                            xl:text-[15px] xl:pl-6 xl:
                                            2xl:text-[15px] 2xl:pl-6 2xl:" />
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
                <div className="grid grid-cols-[25vw_75vw] h-full">
                    <section className="flex justify-center items-center">
                        <Menu />
                    </section>
                    <section className="overflow-y-auto">
                        <Pagina />
                    </section>
                </div>
            ) : (
                <div className="grid grid-rows-[auto_1fr_auto] h-full">
                    <section id="logo" className="flex justify-center items-center shadow-[0_0_7px_rgba(0,0,0,0.2)]">
                        <Logo />
                    </section>
                    <section className="overflow-y-auto">
                        <Pagina />
                    </section>
                    <section id="menu" className="flex justify-center items-center shadow-[0_0_7px_rgba(0,0,0,0.2)]">
                        <Menu />
                    </section>
                </div>
            )}
        </div>
    )
}