import logo from "../assets/logo.png";
import back_button from "../assets/backButton.png";

import feed_button from "../assets/feed-button.png";
import create_post_button from "../assets/create-post-button.png";
import friends_button from "../assets/friends-button.png";
import configuration_button from "../assets/configuration-button.png";
import no_profile from "../assets/no-profile.png";

import { useContext, useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

import { Modal } from "./ModalPages/Modal";
import { getLogedUser } from "../services/user.service";
import { AuthContext } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

export function Profile() {
    const [isModalOpen, setModalOpen] = useState(false);
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
    }, []);

    return (
        <div>
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
                            <NavButton icon={feed_button} label="Feed" to="Feed" />
                            <NavButton icon={friends_button} label="Amigos" to="Friends" />

                            <Link
                                to="Profilesec"
                                className="grid grid-cols-[35%_65%] items-center cursor-pointer border border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline">
                                <div className="flex justify-center">
                                    <img src={userInfo.profileLink || no_profile}  alt="Perfil" className="rounded-full object-cover aspect-square w-12 h-12" />
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
                                    <img src={create_post_button} alt="Settings" className="h-[3vh]" />
                                </div>
                                <div className="flex justify-start">
                                    <h1 className="text-[20px] font-normal text-[#8E8E8E]">Criar</h1>
                                </div>
                            </button>
                        </section>
                    </div>
                </section>
                <section className="flex justify-center items-center">
                    <div className="flex items-center w-[92%]">
                        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                            <div className="pt-8 pl-12">
                                <h2 className="text-[24px] font-semibold mb-4 text-[#303030]">Criar nova publicação</h2>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="flex flex-col w-[80%] pt-8 pb-12">
                                    <div className="flex justify-center">
                                        <div className="h-8 flex justify-center items-center rounded-[8px] text-[15px] bg-[#F37671] text-white w-[32%] relative z-10">
                                            <p>Link da Imagem</p>
                                        </div>
                                        <div className="-translate-x-3">
                                            <input id="mail" name="mail"
                                                type="email"
                                                placeholder="Insira aqui a url da imagem"
                                                className="truncate h-8 p-1.5 pl-6 border border-[#B5B5B5] rounded-[8px] text-sm text-[#303030] text-[15px] focus:outline-none focus:border focus:border-[#F37671]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <Outlet />
                    </div>
                </section>
            </div>
        </div >
    )
}

function NavButton({ icon, label, to }: { icon: string; label: string; to: string }) {
    return (
        <Link
            to={to}
            className="grid grid-cols-[35%_65%] items-center cursor-pointer border border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline">
            <div className="flex justify-center">
                <img src={icon} alt={label} className="h-[3vh]" />
            </div>
            <div className="flex justify-start">
                <h1 className="text-[20px] font-normal text-[#8E8E8E]">{label}</h1>
            </div>
        </Link>
    );
}
