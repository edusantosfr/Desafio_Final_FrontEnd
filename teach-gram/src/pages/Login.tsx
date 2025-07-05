import logo from "../assets/logo.png";
import login_photo from "../assets/login-photo.png";
import google_login from "../assets/google.png";
import apple_login from "../assets/apple.png";
import back_button from "../assets/backButton.png";

import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import { LoadingSpinner } from "../components/loadingSpinner";
import { getUsers } from "../services/user.service";
import { getUsersRepos } from "../services/repos.service";
import { AuthContext } from "../context/AuthContext";

export function Login() {
    const navigate = useNavigate();
    const { setUser, setRepository } = useUser();
    const { setIsAuthenticated } = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isChoosingProfilePicture, setIsChoosingProfilePicture] = useState(false);

    const [status, setStatus] = useState(false);
    const [verify, setVerify] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");

    const handleClick = () => {
        setVerify(false)
    };

    async function loadingLogin() {
        try {
            setStatus(true)

            const responseUser = await getUsers(inputValue)
            const userData = responseUser
            const selectedUser = {
                name: userData.login,
                bio: userData.bio,
                avatar: userData.avatar_url
            };
            setUser([selectedUser])

            const responseUserRepos = await getUsersRepos(inputValue)
            const reposData = responseUserRepos
            const selectedRepos = reposData.map((repos: any) => ({
                id: repos.id,
                name: repos.name,
                description: repos.description,
                visibility: repos.visibility,
                url: repos.html_url,
                language: repos.language
            }));
            setRepository(selectedRepos)
            setIsAuthenticated(true)

            navigate("./Profile")
        } catch (error) {
            setVerify(true)
        } finally {
            setStatus(false)
        }
    };

    return (
        <div >
            {status ? (
                <LoadingSpinner />
            ) : (
                <section className="grid xl:grid-cols-[60%_40%] xl:grid-rows-[100%] h-screen bg-white
                lg:grid-cols-[50%_50%] lg:grid-rows-[100%]
                md:grid-rows-[30%_70%]">
                    {isLogin ? (
                        //LOGIN
                        <section className="flex flex-col items-center justify-center gap-4 w-full min-h-screen px-4 bg-white">
                            <img src={logo} alt="logo imagem" className="w-90 mb-20" />

                            <div className="flex justify-start w-80">
                                <h1 className="text-[20px] font-semibold text-[#303030]">Faça seu login</h1>
                            </div>

                            <div className="flex flex-col w-full max-w-xs gap-2">
                                <label htmlFor="email" className="text-sm text-[#666666]">E-mail</label>
                                <input id="email" type="email" placeholder="Digite seu E-mail" className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]"
                                />
                            </div>

                            <div className="flex flex-col w-full max-w-xs gap-2">
                                <label htmlFor="password" className="text-sm text-[#666666]">Senha</label>
                                <input id="password" type="password" placeholder="Digite sua senha" className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />

                                <div className="flex justify-between items-center w-full max-w-xs text-sm text-[13px]">
                                    <label className="flex items-center gap-1 text-[#303030]">
                                        <input type="checkbox" className="accent-[#F37671]" /> Lembra senha
                                    </label>
                                    <a href="#" className="text-[#666666] hover:underline">Esqueci minha senha</a>
                                </div>
                            </div>

                            <button className="w-full max-w-xs py-2 mt-6 bg-[#F37671] text-white text-[20px] font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-[#f15e59] transition-colors"
                                onClick={loadingLogin}
                                type="submit"> Entrar</button>

                            <p className="text-sm text-[#303030]"> Não possui conta? <a href="#" className="text-[#F37671] font-semibold hover:underline"
                                onClick={() => setIsLogin(false)}
                            >Cadastre-se</a></p>

                            <div className="flex items-center w-full max-w-xs gap-4 my-1">
                                <hr className="flex-grow border-1 border-gray-300" />
                                <span className="text-sm text-gray-400">Entrar com</span>
                                <hr className="flex-grow border-1 border-gray-300" />
                            </div>

                            <div className="w-full flex flex-col items-center gap-4" >
                                <button className="w-full max-w-xs py-3 text-white text-[20px] font-bold rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.10)] hover:bg-gray-100 transition-colors flex justify-center"
                                    onClick={loadingLogin}
                                    type="submit">
                                    <img src={google_login} alt="logo imagem" className="w-45" />
                                </button>

                                <button className="w-full max-w-xs py-3 text-white text-[20px] font-bold rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.10)] hover:bg-gray-100 transition-colors flex justify-center"
                                    onClick={loadingLogin}
                                    type="submit">
                                    <img src={apple_login} alt="logo imagem" className="w-45" />
                                </button>
                            </div>
                        </section>
                    ) : (
                        //CADASTRO
                        <section>
                            {isChoosingProfilePicture ? (
                                <section className="flex flex-col items-center justify-center gap-3 w-full min-h-screen px-4 bg-white">
                                    <button className="cursor-pointer"
                                        onClick={() => setIsChoosingProfilePicture(false)}
                                        type="submit"> 
                                        <img src={back_button} alt="botão de voltar" className="-translate-y-50 -translate-x-110 w-8"/>
                                    </button>

                                    <img src={logo} alt="logo imagem" className="w-90 -translate-y-40" />

                                    <div className="flex flex-col items-center justify-center gap-20">
                                        <div className="flex justify-center w-100">
                                            <h1 className="text-[25px] font-semibold text-[#303030]">Insira o link da sua foto de perfil</h1>
                                        </div>

                                        <div className="flex flex-col w-full max-w-xs gap-1">
                                            <label htmlFor="profileLink" className="text-sm">Link</label>
                                            <input id="profileLink" type="url" placeholder="Insira seu link" className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                        </div>
                                    </div>

                                    <button className="w-full max-w-xs py-2 mt-6 bg-[#F37671] text-white text-[20px] font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-[#f15e59] transition-colors"
                                        onClick={() => setIsChoosingProfilePicture(false)}
                                        type="submit"> Salvar
                                    </button>
                                </section>
                            ) : (
                                <section className="flex flex-col items-center justify-center gap-3 w-full min-h-screen px-4 bg-white">
                                    <img src={logo} alt="logo imagem" className="w-90 mb-5" />

                                    <div className="flex justify-start w-80">
                                        <h1 className="text-[20px] font-semibold text-[#303030]">Crie sua conta</h1>
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="name" className="text-sm">Nome</label>
                                        <input id="name" type="text" placeholder="Digite seu nome" className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="mail" className="text-sm">Email</label>
                                        <input id="mail" type="email" placeholder="Digite seu E-mail" className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="username" className="text-sm">Username</label>
                                        <div className="relative w-full max-w-xs">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none font-light">@</span>
                                            <input id="username" type="text" placeholder="seu_username" className="pl-8 pr-4 py-3 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671] w-full" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="description" className="text-sm">Descrição</label>
                                        <input id="description" type="text" placeholder="Faça uma descrição" className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="phone" className="text-sm">Celular</label>
                                        <input id="phone" type="text" placeholder="Digite se número de celular" className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="password" className="text-sm">Senha</label>
                                        <input id="password" type="password" placeholder="Digite sua senha" className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                    </div>

                                    <button className="w-full max-w-xs py-2 mt-6 bg-[#F37671] text-white text-[20px] font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-[#f15e59] transition-colors"
                                        onClick={() => setIsChoosingProfilePicture(true)}
                                        type="submit"> Próximo
                                    </button>

                                    <p className="text-sm text-[#303030]"> Já possui conta? <a href="#" className="text-[#F37671] font-semibold hover:underline"
                                        onClick={() => setIsLogin(true)}
                                    >Entrar</a></p>
                                </section>
                            )}
                        </section>
                    )}
                    <section className="flex items-center justify-end">
                        <img src={login_photo} alt="login imagem" className=" h-full" />
                    </section>
                </section>
            )}
        </div>
    )
}