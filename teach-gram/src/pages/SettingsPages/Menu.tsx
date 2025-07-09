import back_button from "../../assets/backButton.png";
import config_detail from "../../assets/config-detail.png";
import arrow from "../../assets/arrow.png";

import { Modal } from "../ModalPages/Modal";
import { LoadingSpinner } from "../../components/loadingSpinner";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { deleteUser } from "../../services/user.service";

export function Menu() {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState(false);

    const handleDelete = async () => {
        setStatus(true);
        setModalOpen(false);

        try {
            await deleteUser();
        } catch (error) {
            console.error("Erro ao deletar o user:", error);
        } finally {
            navigate('/');
            setStatus(false);
        }
    };

    return (
        <div>
            {status ? (
                <LoadingSpinner />
            ) : (
                <div className="w-full grid grid-cols-[75vw_25vw]">
                    <div className="flex justify-center">
                        <div className="grid grid-rows-[15vh_85vh] w-[85%]">
                            <section className="flex flex-row gap-5 items-center">
                                <button
                                    type="button"
                                    onClick={() => navigate("/Profile/Profilesec")}
                                    className="cursor-pointer">
                                    <img src={back_button} alt="Voltar" className="h-[3vh]" />
                                </button>
                            </section>
                            <div className="flex justify-center items-center">
                                <section className="w-[80%] h-[90%] flex flex-col gap-12">

                                    <NavButton icon={arrow} label="Configurações de Conta" to="/Settings/Info" />
                                    <NavButton icon={arrow} label="Editar Perfil" to="/Settings/Edit" />

                                    <button className="flex cursor-pointer w-[14vw]"
                                        onClick={() => setModalOpen(true)}>
                                        <h1 className="text-[24px] font-light text-[#F37671] hover:underline">Excluir Conta</h1>
                                    </button>

                                    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                                        <div className="pt-8 pb-3 pl-12">
                                            <h2 className="text-[24px] font-semibold mb-4 text-[#303030]">Excluir conta</h2>
                                        </div>
                                        <hr className="border-[#CECECE] border-1" />
                                        <div className="flex items-center justify-center">
                                            <div className="flex flex-col w-[80%] pt-8 pb-8 gap-10">
                                                <p className="mb-4 text-[15px] text-[#303030]">Todos os seus dados serão excluídos.</p>
                                                <div className="flex justify-center gap-12">
                                                    <button
                                                        onClick={() => setModalOpen(false)}
                                                        className="px-10 py-0.5 rounded-[8px] text-[15px] border-[#F37671] border-1 text-[#F37671] cursor-pointer">
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete()}
                                                        className="px-10 py-0.5 bg-[#F37671] text-white rounded-[8px] text-[15px] cursor-pointer">
                                                        Confirmar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>

                                </section>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
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
            className="w-[25vw] cursor-pointer flex items-center justify-between">
            <h1 className="text-[24px] font-semibold text-[#303030] hover:text-[#F37671]">{label}</h1>
            <img src={icon}
                alt=""
                className="h-[2.5vh]" />
        </Link>
    );
}