import back_button from "../../assets/backButton.png";
import config_detail from "../../assets/config-detail.png";
import arrow from "../../assets/arrow.png";

import { AuthContext } from "../../context/AuthContext";
import { Modal } from "../ModalPages/Modal";
import { LoadingSpinner } from "../../components/loadingSpinner";
import { deleteUser } from "../../services/user.service";

import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function Menu() {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [status, setStatus] = useState(false);
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleDelete = async () => {
        setStatus(true);
        setModalOpen(false);

        try {
            await deleteUser();
        } catch (error) {
            console.error("Erro ao deletar o user:", error);
        } finally {
            navigate('/Profile/feed');
            setStatus(false);
        }
    }

    const handleLogout = () => {
        setStatus(true);
        sessionStorage.clear(); 
        localStorage.clear();
        setLogoutModalOpen(false);
        setIsAuthenticated(false);

        navigate("../");
    }

    return (
        <div>
            {status ? (
                <LoadingSpinner />
            ) : (
                <div className="w-full grid grid-cols-[100vw]
                sm:grid-cols-[100vw]
                md:grid-cols-[50vw_50vw]
                lg:grid-cols-[50vw_50vw]
                xl:grid-cols-[75vw_25vw]">
                    <div className="flex justify-center">
                        <div className="grid grid-rows-[15vh_85vh] w-[85%] gap-5
                        sm:gap-0
                        md:gap-0
                        lg:gap-0
                        xl:gap-0">
                            <section className="flex flex-row gap-5 items-center">
                                <button
                                    type="button"
                                    onClick={() => navigate("/Profile/feed")}
                                    className="cursor-pointer">
                                    <img src={back_button} alt="Voltar" className="h-[2vh]
                                    sm:h-[2.5vh]
                                    md:h-[2.5vh]
                                    lg:h-[3vh]
                                    xl:h-[3vh]" />
                                </button>
                            </section>
                            <div className="flex justify-center items-center">
                                <section className="w-[90%] h-[90%] flex flex-col gap-12
                                sm:w-[80%]
                                md:w-[80%]
                                lg:w-[80%]
                                xl:w-[80%]">

                                    <NavButton icon={arrow} label="Configurações de Conta" to="/Settings/Info" />
                                    <NavButton icon={arrow} label="Editar Perfil" to="/Settings/Edit" />

                                    <button className="flex cursor-pointer w-full
                                    sm:w-full
                                    md:w-[50vw]
                                    lg:w-[14vw]
                                    xl:w-[14vw]"
                                        onClick={() => setModalOpen(true)}>
                                        <h1 className="text-[17px] font-light text-[#F37671] hover:underline
                                        sm:text-[24px]
                                        md:text-[24px]
                                        lg:text-[22px]
                                        xl:text-[24px]">Excluir Conta</h1>
                                    </button>

                                    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                                        <div className="bg-white rounded-[30px] shadow-lg z-60 max-w-lg w-[280px] h-fit
                                        sm:w-[512px]
                                        md:w-[512px]
                                        lg:w-[512px]
                                        xl:w-[512px]">
                                            <div className="pt-8 pb-3 pl-0 justify-center flex
                                            sm:block sm:pl-12
                                            md:block md:pl-12
                                            lg:block lg:pl-12
                                            xl:block xl:pl-12">
                                                <h2 className="text-[20px] font-semibold mb-4 text-[#303030]
                                                sm:text-[24px]
                                                md:text-[24px]
                                                lg:text-[24px]
                                                xl:text-[24px]">Excluir conta</h2>
                                            </div>
                                            <hr className="border-[#CECECE] border-1" />
                                            <div className="flex items-center justify-center">
                                                <div className="flex flex-col w-[80%] py-8 gap-2
                                                sm:gap-10
                                                md:gap-10
                                                lg:gap-10
                                                xl:gap-10">
                                                    <p className="mb-4 text-[13px] text-[#303030] text-center
                                                    sm:text-[15px] sm:text-left
                                                    md:text-[15px] md:text-left
                                                    lg:text-[15px] lg:text-left
                                                    xl:text-[15px] xl:text-left">Todos os seus dados serão excluídos.</p>
                                                    <div className="flex justify-center gap-4
                                                    sm:gap-12
                                                    md:gap-12
                                                    lg:gap-12
                                                    xl:gap-12">
                                                        <button
                                                            onClick={() => setModalOpen(false)}
                                                            className="px-2 py-0.5 rounded-[8px] text-[12px] border-[#F37671] border-1 text-[#F37671] cursor-pointer
                                                            sm:text-[15px] sm:px-10
                                                            md:text-[15px] md:px-10
                                                            lg:text-[15px] lg:px-10
                                                            xl:text-[15px] xl:px-10">
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete()}
                                                            className="px-2 py-0.5 bg-[#F37671] text-white rounded-[8px] text-[12px] cursor-pointer
                                                            sm:text-[15px] sm:px-10
                                                            md:text-[15px] md:px-10
                                                            lg:text-[15px] lg:px-10
                                                            xl:text-[15px] xl:px-10">
                                                            Confirmar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>

                                    <button className="flex cursor-pointer w-full
                                    sm:w-full
                                    md:w-[50vw]
                                    lg:w-[14vw]
                                    xl:w-[14vw]"
                                        onClick={() => setLogoutModalOpen(true)}>
                                        <h1 className="text-[17px] font-light text-[#F37671] hover:underline
                                        sm:text-[24px]
                                        md:text-[24px]
                                        lg:text-[22px]
                                        xl:text-[24px]">Sair da Conta</h1>
                                    </button>

                                    <Modal isOpen={isLogoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
                                        <div className="bg-white rounded-[30px] shadow-lg z-60 max-w-lg w-[280px] h-fit
                                        sm:w-[512px]
                                        md:w-[512px]
                                        lg:w-[512px]
                                        xl:w-[512px]">
                                            <div className="pt-8 pb-3 pl-0 justify-center flex
                                            sm:block sm:pl-12
                                            md:block md:pl-12
                                            lg:block lg:pl-12
                                            xl:block xl:pl-12">
                                                <h2 className="text-[20px] font-semibold mb-4 text-[#303030]
                                                sm:text-[24px]
                                                md:text-[24px]
                                                lg:text-[24px]
                                                xl:text-[24px]">Sair da conta</h2>
                                            </div>
                                            <hr className="border-[#CECECE] border-1" />
                                            <div className="flex items-center justify-center">
                                                <div className="flex flex-col w-[80%] py-8 gap-2
                                                sm:gap-10
                                                md:gap-10
                                                lg:gap-10
                                                xl:gap-10">
                                                    <p className="mb-4 text-[13px] text-[#303030] text-center
                                                    sm:text-[15px] sm:text-left
                                                    md:text-[15px] md:text-left
                                                    lg:text-[15px] lg:text-left
                                                    xl:text-[15px] xl:text-left">Você será redirecionado para a página de Login.</p>
                                                    <div className="flex justify-center gap-4
                                                    sm:gap-12
                                                    md:gap-12
                                                    lg:gap-12
                                                    xl:gap-12">
                                                        <button
                                                            onClick={() => setLogoutModalOpen(false)}
                                                            className="px-2 py-0.5 rounded-[8px] text-[12px] border-[#F37671] border-1 text-[#F37671] cursor-pointer
                                                            sm:text-[15px] sm:px-10
                                                            md:text-[15px] md:px-10
                                                            lg:text-[15px] lg:px-10
                                                            xl:text-[15px] xl:px-10">
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            onClick={() => handleLogout()}
                                                            className="px-2 py-0.5 bg-[#F37671] text-white rounded-[8px] text-[12px] cursor-pointer
                                                            sm:text-[15px] sm:px-10
                                                            md:text-[15px] md:px-10
                                                            lg:text-[15px] lg:px-10
                                                            xl:text-[15px] xl:px-10">
                                                            Confirmar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>

                                </section>
                            </div>
                        </div>
                    </div>
                    <div className="justify-end hidden
                    sm:hidden
                    md:flex
                    lg:flex
                    xl:flex">
                        <img src={config_detail}
                            alt=""
                            className="h-screen" />
                    </div>
                </div>
            )}
        </div>
    )
}

function NavButton({ icon, label, to }: { icon: string; label: string; to: string }) {
    return (
        <Link
            to={to}
            className="w-full cursor-pointer flex items-center justify-between
            sm:w-full
            md:w-[45vw]
            lg:w-[50vw]
            xl:w-[30vw]">
            <h1 className="text-[17px] font-semibold text-[#303030] hover:text-[#F37671]
            sm:text-[24px]
            md:text-[24px]
            lg:text-[22px]
            xl:text-[24px]">{label}</h1>
            <img src={icon}
                alt=""
                className="h-[2vh]
                sm:h-[2.5vh]
                md:h-[2.5vh]
                lg:h-[2.5vh]
                xl:h-[2.5vh]" />
        </Link>
    );
}