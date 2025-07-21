import logo from "../assets/logo.png";
import login_photo from "../assets/login-photo.png";
import google_login from "../assets/google.png";
import apple_login from "../assets/apple.png";
import back_button from "../assets/backButton.png";

import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { createUser, loginUser } from "../services/user.service";
import { LoadingSpinner } from "../components/loadingSpinner";

export function Login() {
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isChoosingProfilePicture, setIsChoosingProfilePicture] = useState(false);
    const [status, setStatus] = useState(false);
    const [verify, setVerify] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [loginData, setLoginData] = useState({
        mail: '',
        password: ''
    })

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        phone: '',
        mail: '',
        password: '',
        profileLink: '',
        description: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (isLogin) {
            setLoginData({ ...loginData, [e.target.name]: e.target.value });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === "username"
                    ? value.startsWith('@') ? value : `@${value}`
                    : value
            }));
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(true);
        localStorage.clear();
        sessionStorage.clear();
        try {
            const response = await loginUser({
                mail: loginData.mail,
                password: loginData.password
            });

            const token = response.token;
            if (rememberMe) {
                localStorage.setItem("token", token);
            } else {
                sessionStorage.setItem("token", token);
            }

            setIsAuthenticated(true);

            const userId = response.user.id;
            localStorage.setItem('userId', userId);

            navigate('/Profile/feed');
        } catch (error: any) {
            const msg = error.response?.data?.message;
            setMsg(msg);
            setVerify(true);
        } finally {
            setStatus(false);
        }
    }

    const handleRegister = async () => {
        setStatus(true);
        try {
            await createUser(formData);
            setIsAuthenticated(true);
            setStatus(false);
            setIsChoosingProfilePicture(false);
            setIsLogin(true);
            setVerify(false);

        } catch (error: any) {
            const msg = error.response?.data?.message;
            setIsChoosingProfilePicture(false);
            setStatus(false);
            setMsg(msg);
            setVerify(true);
        }
    }

    return (
        <div className="flex items-center justify-center w-full h-screen">
            {status ? (
                <LoadingSpinner />
            ) : (
                <section className="grid h-screen grid-rows-[100%] w-full
                sm:grid-cols-[100%] mg:grid-rows-[100%] 
                md:grid-cols-[100%] mg:grid-rows-[100%]
                lg:grid-cols-[47%_53%] lg:grid-rows-[100%]
                xl:grid-cols-[50%_50%] xl:grid-rows-[100%]">
                    {isLogin ? (
                        //LOGIN
                        <section className="flex flex-col items-center justify-center gap-3 w-screen px-10 bg-white
                        sm:gap-3 sm:h-screen sm:w-full sm:px-4
                        md:gap-3 md:h-screen md:w-full md:px-4
                        lg:gap-3 lg:h-screen lg:w-full lg:px-4
                        xl:gap-3 xl:h-screen xl:w-full xl:px-4">
                            <img src={logo} alt="logo imagem" className="w-53 mb-8
                            sm:w-80 sm:mb-15
                            md:w-80 md:mb-20
                            lg:w-70 lg:mb-15
                            xl:w-80 xl:mb-15"/>
                            <div className="flex justify-start w-80">
                                <h1 className="text-[18px] font-semibold text-[#303030] px-10 pb-3
                                sm:text-[18px] sm:w-[100%] sm:px-0 sm:pb-0
                                md:text-[18px] md:w-[100%] md:px-0 md:pb-0
                                lg:text-[18px] lg:w-[100%] lg:px-4 lg:pb-0
                                xl:text-[20px] xl:w-[100%] xl:px-0 xl:pb-0"
                                >Faça seu login</h1>
                            </div>

                            <form onSubmit={handleLogin} className="flex flex-col w-full items-center gap-4
                            sm:gap-3 sm:w-full
                            md:gap-3 md:w-full
                            lg:gap-3 lg:w-[65%]
                            xl:gap-3 xl:w-full">
                                <div className="flex flex-col w-full max-w-xs gap-1.5
                                sm:gap-1
                                md:gap-1
                                lg:gap-1
                                xl:gap-1">
                                    <label htmlFor="mail" className="text-[13px] text-[#666666]
                                    sm:text-[14px]
                                    md:text-[14px]
                                    lg:text-[13px]
                                    xl:text-[13px]">E-mail</label>
                                    <input id="mail" name="mail" value={loginData.mail} onChange={handleChange}
                                        type="email"
                                        placeholder="Digite seu E-mail"
                                        className="p-2.5 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]
                                        sm:p-3
                                        md:p-3
                                        lg:p-2.5
                                        xl:p-3"/>
                                </div>

                                <div className="flex flex-col w-full max-w-xs gap-1.5
                                sm:gap-1
                                md:gap-1
                                lg:gap-1
                                xl:gap-1">
                                    <label htmlFor="password" className="text-[13px] text-[#666666]
                                    sm:text-[14px]
                                    md:text-[14px]
                                    lg:text-[13px]
                                    xl:text-[13px]"
                                    >Senha</label>
                                    <input id="password" name="password" value={loginData.password} onChange={handleChange}
                                        type="password"
                                        placeholder="Digite sua senha"
                                        className="p-2.5 pl-5 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]
                                        sm:p-3
                                        md:p-3
                                        lg:p-2.5
                                        xl:p-3" />

                                    <div className="flex justify-between items-center w-full max-w-xs text-sm text-[12px]
                                    sm:text-[13px]
                                    md:text-[13px]
                                    lg:text-[13px]
                                    xl:text-[13px]">
                                        <label className="flex items-center gap-1 text-[#303030] cursor-pointer">
                                            <input type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="accent-[#F37671] cursor-pointer" /> Lembrar senha
                                        </label>
                                        <a href="#" className="text-[#666666] hover:underline">Esqueci minha senha</a>
                                    </div>

                                    <div className="flex justify-end font-bold text-[14px] text-[#F37671]
                                    sm:text-[15px]
                                    md:text-[15px]
                                    lg:text-[15px]
                                    xl:text-[15px]">
                                        {verify ? (
                                            <div className="flex flex-row items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#F37671]"></div>
                                                <h1>{msg}</h1>
                                            </div>
                                        ) : (
                                            <h1 className="invisible">Senha incorreta</h1>
                                        )}
                                    </div>

                                </div>

                                <button className="w-full max-w-xs py-1.5 bg-[#F37671] text-white text-[18px] font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-[#f15e59] transition-colors cursor-pointer
                                sm:py-2 sm:text-[20px]
                                md:py-2 md:text-[20px]
                                lg:py-2 lg:text-[18px]
                                xl:py-2 xl:text-[20px]"
                                    type="submit"> Entrar</button>
                            </form>

                            <p className="text-[13px] text-[#303030]
                            sm:text-[14px]
                            md:text-[14px]
                            lg:text-[13px]
                            xl:text-[14px]"> Não possui conta? <a href="#" className="text-[#F37671] font-semibold hover:underline"
                                    onClick={() => setIsLogin(false)}
                                >Cadastre-se</a></p>

                            <div className="flex items-center w-full max-w-xs gap-4 my-1
                            sm:max-w-xs
                            md:max-w-xs
                            lg:max-w-72
                            xl:max-w-xs">
                                <hr className="flex-grow border-1 border-gray-300" />
                                <span className="text-[12px] text-gray-400
                                sm:text-[14px]
                                md:text-[14px]
                                lg:text-[13px]
                                xl:text-[14px]">Entrar com</span>
                                <hr className="flex-grow border-1 border-gray-300" />
                            </div>

                            <div className="w-full flex flex-col items-center gap-4" >
                                <button className="w-full max-w-xs py-3 text-white text-[20px] font-bold rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.10)] hover:bg-gray-100 transition-colors flex justify-center cursor-pointe
                                sm:max-w-xs
                                md:max-w-xs
                                lg:max-w-72
                                xl:max-w-xs"
                                    type="submit">
                                    <img src={google_login} alt="logo imagem" className="w-40
                                    sm:w-45
                                    md:w-45
                                    lg:w-42
                                    xl:w-45" />
                                </button>

                                <button className="w-full max-w-xs py-3 text-white text-[20px] font-bold rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.10)] hover:bg-gray-100 transition-colors flex justify-center cursor-pointer
                                sm:max-w-xs
                                md:max-w-xs
                                lg:max-w-72
                                xl:max-w-xs"
                                    type="submit">
                                    <img src={apple_login} alt="logo imagem" className="w-40
                                    sm:w-45
                                    md:w-45
                                    lg:w-42
                                    xl:w-45" />
                                </button>
                            </div>
                        </section>
                    ) : (
                        //CADASTRO
                        <section className="flex items-center justify-center">
                            {isChoosingProfilePicture ? (
                                <section className="flex flex-col items-center justify-center gap-3 w-full min-h-screen px-4 bg-white">
                                    <button className="cursor-pointer"
                                        onClick={() => setIsChoosingProfilePicture(false)} type="button">
                                        <img src={back_button} alt="botão de voltar" className="-translate-y-28 -translate-x-33 w-4
                                        sm:-translate-y-50 sm:-translate-x-60 sm:w-7
                                        md:-translate-y-50 md:-translate-x-75 md:w-7
                                        lg:-translate-y-45 lg:-translate-x-50 lg:w-6
                                        xl:-translate-y-35 xl:-translate-x-65 xl:w-7
                                        2xl:-translate-y-10 2xl:-translate-x-30 2xl:w-7" />
                                    </button>

                                    <img src={logo} alt="logo imagem" className="w-57 -translate-y-30
                                    sm:-translate-y-40 sm:w-90
                                    md:-translate-y-40 md:w-90
                                    lg:-translate-y-40 lg:w-70
                                    xl:-translate-y-25 xl:w-80" />

                                    <div className="flex flex-col items-center justify-center gap-15
                                    sm:gap-20
                                    md:gap-20
                                    lg:gap-20
                                    xl:gap-12">
                                        <div className="flex justify-center w-65
                                            sm:w-100
                                            md:w-100
                                            lg:w-100
                                            xl:w-100">
                                            <h1 className="text-[17px] font-semibold text-[#303030]
                                            sm:text-[25px]
                                            md:text-[25px]
                                            lg:text-[20px]
                                            xl:text-[25px]">Insira o link da sua foto de perfil</h1>
                                        </div>

                                        <div className="flex flex-col w-60 max-w-xs gap-1
                                            sm:w-full
                                            md:w-full
                                            lg:w-70
                                            xl:w-full">
                                            <label htmlFor="profileLink" className="text-sm">Link</label>
                                            <input name="profileLink" id="profileLink"
                                                type="url"
                                                placeholder="Insira seu link"
                                                value={formData.profileLink}
                                                onChange={handleChange}
                                                className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]
                                                sm:p-2.5
                                                md:p-2.5
                                                lg:p-2.5
                                                xl:p-3" />
                                        </div>
                                    </div>

                                    <button className="w-60 max-w-xs py-2 mt-2 bg-[#F37671] text-white text-[18px] font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-[#f15e59] transition-colors mb-20
                                    sm:w-full sm:text-[20px] sm:mt-6 sm:mb-0
                                    md:w-full md:text-[20px] md:mt-6 md:mb-0
                                    lg:w-70 lg:text-[18px] lg:mt-4 lg:mb-0
                                    xl:w-full xl:text-[20px] xl:mt-6 xl:mb-0"
                                        onClick={handleRegister}
                                        type="submit"> Salvar
                                    </button>
                                </section>
                            ) : (
                                <section className="flex flex-col items-center justify-center gap-2 w-70 min-h-screen px-4 bg-white
                                sm:gap-2 sm:w-full
                                md:gap-2 md:w-full
                                lg:gap-2 lg:w-full
                                xl:gap-2 xl:w-80">
                                    <img src={logo} alt="logo imagem" className="w-53 mb-4
                                    sm:w-90 sm:mb-5
                                    md:w-90 md:mb-5 
                                    lg:w-70 lg:mb-5
                                    xl:w-80 xl:mb-5" />

                                    <div className="flex justify-start w-62
                                    sm:w-80
                                    md:w-80
                                    lg:w-80
                                    xl:w-72">
                                        <h1 className="text-[18px] font-semibold text-[#303030]
                                        sm:text-[20px]
                                        md:text-[20px]
                                        lg:text-[18px]
                                        xl:text-[20px]">Crie sua conta</h1>
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="name" className="text-[12px]
                                        sm:text-[14px]
                                        md:text-[14px]
                                        lg:text-[14px]
                                        xl:text-[13px]
                                        ">Nome</label>
                                        <input name="name" id="name" value={formData.name} onChange={handleChange}
                                            type="text"
                                            placeholder="Digite seu nome"
                                            className="p-2 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]
                                            sm:p-2.5 sm:pl-4
                                            md:p-2.5 md:pl-4
                                            lg:p-2.5 lg:pl-4
                                            xl:p-2.5 xl:pl-4" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="mail" className="text-[12px]
                                        sm:text-[14px]
                                        md:text-[14px]
                                        lg:text-[14px]
                                        xl:text-[13px]">Email</label>
                                        <input name="mail" id="mail" value={formData.mail} onChange={handleChange}
                                            type="email"
                                            placeholder="Digite seu E-mail"
                                            className="p-2 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]
                                            sm:p-2.5 sm:pl-4
                                            md:p-2.5 md:pl-4
                                            lg:p-2.5 lg:pl-4
                                            xl:p-2.5 xl:pl-4" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="username" className="text-[12px]
                                        sm:text-[14px]
                                        md:text-[14px]
                                        lg:text-[14px]
                                        xl:text-[13px]">Username</label>
                                        <div className="relative w-full max-w-xs">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none font-light">@</span>
                                            <input name="username" id="username" value={formData.username} onChange={handleChange}
                                                type="text"
                                                placeholder="seu_username"
                                                className="pl-8 pr-4 py-2 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671] w-full
                                                sm:p-2.5 sm:pl-8
                                                md:p-2.5 md:pl-8
                                                lg:p-2.5 lg:pl-8
                                                xl:p-2.5 xl:pl-8" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="description" className="text-[12px]
                                        sm:text-[14px]
                                        md:text-[14px]
                                        lg:text-[14px]
                                        xl:text-[13px]">Descrição</label>
                                        <input name="description" id="description" value={formData.description} onChange={handleChange}
                                            type="text"
                                            placeholder="Faça uma descrição"
                                            className="p-2 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]
                                            sm:p-2.5 sm:pl-4
                                            md:p-2.5 md:pl-4
                                            lg:p-2.5 lg:pl-4
                                            xl:p-2.5 xl:pl-4" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="phone" className="text-[12px]
                                        sm:text-[14px]
                                        md:text-[14px]
                                        lg:text-[14px]
                                        xl:text-[13px]">Celular</label>
                                        <input name="phone" id="phone" value={formData.phone} onChange={handleChange}
                                            type="text"
                                            placeholder="Digite se número de celular"
                                            className="p-2 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671
                                            sm:p-2.5 sm:pl-4
                                            md:p-2.5 md:pl-4
                                            lg:p-2.5 lg:pl-4
                                            xl:p-2.5 xl:pl-4" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="password" className="text-[12px]
                                        sm:text-[14px]
                                        md:text-[14px]
                                        lg:text-[14px]
                                        xl:text-[13px]">Senha</label>
                                        <input name="password" id="password" value={formData.password} onChange={handleChange}
                                            type="password"
                                            placeholder="Digite sua senha"
                                            className="p-2 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]
                                            sm:p-2.5 sm:pl-4
                                            md:p-2.5 md:pl-4
                                            lg:p-2.5 lg:pl-4
                                            xl:p-2.5 xl:pl-4" />

                                        <div className="flex justify-end font-bold text-[12px] text-[#F37671]
                                        sm:text-[15px]
                                        md:text-[15px]
                                        lg:text-[15px]
                                        xl:text-[15px]">
                                            {verify ? (
                                                <div className="flex flex-row items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F37671]"></div>
                                                    <h1>{msg}</h1>
                                                </div>
                                            ) : (
                                                <h1 className="invisible">Senha incorreta</h1>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        className="w-full max-w-xs py-2 bg-[#F37671] text-white text-[17px] font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-[#f15e59] transition-colors cursor-pointer
                                        sm:text-[20px]
                                        md:text-[20px]
                                        lg:text-[18px]
                                        xl:text-[18px]"
                                        onClick={() => setIsChoosingProfilePicture(true)}
                                        type="button">
                                        Próximo
                                    </button>

                                    <p className="text-[13px] text-[#303030]
                                    sm:text-[15px]
                                    md:text-[15px]
                                    lg:text-[14px]
                                    xl:text-[15px]"> Já possui conta? <a href="#" className="text-[#F37671] font-semibold hover:underline"
                                            onClick={() => setIsLogin(true)}
                                        >Entrar</a></p>
                                </section>
                            )}
                        </section>
                    )}
                    <section className="items-center justify-end hidden
                    sm:hidden
                    md:hidden
                    lg:flex
                    xl:flex">
                        <img src={login_photo} alt="login imagem" className=" h-full" />
                    </section>
                </section>
            )}
        </div>
    )
}