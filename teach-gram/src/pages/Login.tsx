import logo from "../assets/logo.png";
import login_photo from "../assets/login-photo.png";
import google_login from "../assets/google.png";
import apple_login from "../assets/apple.png";
import back_button from "../assets/backButton.png";

import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { AuthContext } from "../context/AuthContext";

import { createUser, loginUser } from "../services/user.service";
import { LoadingSpinner } from "../components/loadingSpinner";

export function Login() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const { setIsAuthenticated } = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isChoosingProfilePicture, setIsChoosingProfilePicture] = useState(false);
    const [status, setStatus] = useState(false);

    const [loginData, setLoginData] = useState({
        mail: '',
        password: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        phone: '',
        mail: '',
        password: '',
        profileLink: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLogin) {
            setLoginData({ ...loginData, [e.target.name]: e.target.value });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(true);
        try {
            const response = await loginUser({
                mail: loginData.mail,
                password: loginData.password
            });

            const token = response.token;
            localStorage.setItem('token', token);
            setIsAuthenticated(true);

            const user = response.user;
            setUser({
                id: user.id,
                name: user.name,
                username: user.username,
                phone: user.phone,
                mail: user.mail,
                profileLink: user.profileLink,
                description: user.description
            });

            navigate('/Profile');
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        } finally {
            setStatus(false);
        }
    };

    const handleFinalRegister = async () => {
        setStatus(true);
        try {
            const newUser = await createUser(formData);
            setUser({
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                phone: newUser.phone,
                mail: newUser.mail,
                profileLink: newUser.profileLink,
                description: newUser.description
            });
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Erro ao registrar:', error);
        } finally {
            setStatus(false);
            setIsLogin(true);
            setIsChoosingProfilePicture(false);
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

                            <form onSubmit={handleLogin} className="flex flex-col w-full items-center">
                                <div className="flex flex-col w-full max-w-xs gap-2">
                                    <label htmlFor="mail" className="text-sm text-[#666666]">E-mail</label>
                                    <input name="mail" value={loginData.mail} onChange={handleChange} 
                                    type="email" 
                                    placeholder="Digite seu E-mail" 
                                    className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]"
                                    />
                                </div>

                                <div className="flex flex-col w-full max-w-xs gap-2">
                                    <label htmlFor="password" className="text-sm text-[#666666]">Senha</label>
                                    <input name="password" value={loginData.password} onChange={handleChange} 
                                    type="text" 
                                    placeholder="Digite sua senha" 
                                    className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />

                                    <div className="flex justify-between items-center w-full max-w-xs text-sm text-[13px]">
                                        <label className="flex items-center gap-1 text-[#303030]">
                                            <input type="checkbox" className="accent-[#F37671]" /> Lembra senha
                                        </label>
                                        <a href="#" className="text-[#666666] hover:underline">Esqueci minha senha</a>
                                    </div>
                                </div>

                                <button className="w-full max-w-xs py-2 mt-6 bg-[#F37671] text-white text-[20px] font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-[#f15e59] transition-colors"
                                    type="submit"> Entrar</button>
                            </form>

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
                                    //onClick={loadingLogin}
                                    type="submit">
                                    <img src={google_login} alt="logo imagem" className="w-45" />
                                </button>

                                <button className="w-full max-w-xs py-3 text-white text-[20px] font-bold rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.10)] hover:bg-gray-100 transition-colors flex justify-center"
                                    //onClick={loadingLogin}
                                    type="submit">
                                    <img src={apple_login} alt="logo imagem" className="w-45" />
                                </button>
                            </div>
                        </section>
                    ) : (
                        //CADASTRO
                        <section>
                            {isChoosingProfilePicture ? (
                                <section className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
                                    <button onClick={() => setIsChoosingProfilePicture(false)} type="button">
                                        <img src={back_button} alt="Voltar" className="w-8" />
                                    </button>

                                    <img src={logo} alt="Logo" className="w-90 mb-4" />
                                    <h1 className="text-[25px] font-semibold text-[#303030] mb-4">Insira o link da sua foto de perfil</h1>

                                    <input
                                        name="profileLink"
                                        value={formData.profileLink}
                                        onChange={handleChange}
                                        type="url"
                                        placeholder="https://..."
                                        className="p-3 pl-4 border border-[#B5B5B5] rounded-lg w-full max-w-xs text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]"
                                    />

                                    <button
                                        onClick={handleFinalRegister}
                                        className="w-full max-w-xs py-2 mt-6 bg-[#F37671] text-white text-[20px] font-bold rounded-lg hover:bg-[#f15e59] transition-colors"
                                    >
                                        Finalizar cadastro
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
                                        <input name="name" value={formData.name} onChange={handleChange}
                                            type="text"
                                            placeholder="Digite seu nome"
                                            className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]"/>
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="mail" className="text-sm">Email</label>
                                        <input name="mail" value={formData.mail} onChange={handleChange}
                                            type="email"
                                            placeholder="Digite seu E-mail"
                                            className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]"/>
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="username" className="text-sm">Username</label>
                                        <div className="relative w-full max-w-xs">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none font-light">@</span>
                                            <input name="username" value={formData.username} onChange={handleChange}
                                                type="text"
                                                placeholder="seu_username"
                                                className="pl-8 pr-4 py-3 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671] w-full" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="description" className="text-sm">Descrição</label>
                                        <input name="description" value={formData.description} onChange={handleChange}
                                            type="text"
                                            placeholder="Faça uma descrição"
                                            className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="phone" className="text-sm">Celular</label>
                                        <input name="phone" value={formData.phone} onChange={handleChange}
                                            type="text"
                                            placeholder="Digite se número de celular"
                                            className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                    </div>

                                    <div className="flex flex-col w-full max-w-xs gap-1">
                                        <label htmlFor="password" className="text-sm">Senha</label>
                                        <input name="password" value={formData.password} onChange={handleChange}
                                            type="password"
                                            placeholder="Digite sua senha"
                                            className="p-3 pl-4 border border-[#B5B5B5] rounded-lg text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#F37671]" />
                                    </div>

                                    <button
                                        className="w-full max-w-xs py-2 mt-6 bg-[#F37671] text-white text-[20px] font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-[#f15e59] transition-colors"
                                        onClick={() => setIsChoosingProfilePicture(true)}
                                        type="button">
                                        Próximo
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