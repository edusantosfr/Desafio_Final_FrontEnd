import logo from "../assets/logo.png";
import back_button from "../assets/backButton.png";

import feed_button from "../assets/feed-button.png";
import create_post_button from "../assets/create-post-button.png";
import friends_button from "../assets/friends-button.png";
import configuration_button from "../assets/configuration-button.png";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link, Outlet } from "react-router-dom";

export function Profile() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

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
                            <NavButton icon={feed_button} label="Feed" to="feed" />
                            <NavButton icon={friends_button} label="Amigos" to="friends" />
                            <NavButton icon={feed_button} label="Perfil" to="profilesec" />
                            {/* <NavButton icon={configuration_button} label="Configurações" to="settings" /> */}

                            <button
                                type="button"
                                onClick={() => navigate("../Settings")}
                                className="grid grid-cols-[35%_65%] items-center cursor-pointer border border-[#E2E2E2] rounded-[15px] h-[9vh] w-[15vw] no-underline">
                                <div className="flex justify-center">
                                    <img src={configuration_button} alt="settings" className="h-[3vh]" />
                                </div>
                                <div className="flex justify-start">
                                    <h1 className="text-[20px] font-normal text-[#8E8E8E]">Configurações</h1>
                                </div>
                            </button>

                            <NavButton icon={create_post_button} label="Criar" to="create" />
                        </section>
                    </div>
                </section>

                <section className="flex justify-center items-center">
                    <div className="flex items-center w-[92%]">
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
