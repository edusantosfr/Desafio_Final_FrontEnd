import back_button from "../../assets/backButton.png";
import config_detail from "../../assets/config-detail.png";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { patchUserInfo } from "../../services/user.service";
import { useUser } from "../../context/UserContext";

export function ProfileInfo() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [status, setStatus] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  const [loginData, setLoginData] = useState({
        name: '',
        mail: '',
        phone: '',
        password: ''
  })

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(true);
    try {
      const response = await patchUserInfo({
        name: '',
        mail: '',
        phone: '',
        password: ''
      });

      const token = response.token;
      localStorage.setItem('token', token);

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
      navigate('/Settings/Menu');
    } catch (error) {
      console.error("Erro ao fazer a edição:", error);
    } finally {
      setStatus(false);
    }
  }


  return (
    <div className="w-full grid grid-cols-[75vw_25vw]">
      <div className="flex justify-center">
        <div className="grid grid-rows-[15vh_85vh] w-[85%]">
          <section className="flex flex-row gap-5 items-center">
            <button
              type="button"
              onClick={() => navigate("/Settings/Menu ")}
              className="cursor-pointer">
              <img src={back_button} alt="Voltar" className="h-[3vh]" />
            </button>
          </section>
          <section className="flex justify-center items-center">
            <div className="w-[80%] h-[90%] flex flex-col gap-12">
              {status ? (
                <LoadingSpinnerSmall />
              ) : (
                <div className="flex flex-col gap-10">
                  <div
                    className="w-[25vw] flex items-center justify-between">
                    <h1 className="text-[25px] font-semibold text-[#303030]">Configurações de Conta</h1>
                  </div>

                  <form onSubmit={handleEditProfile} className="flex flex-col w-full gap-10">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="name" className="text-[18px]">Nome</label>
                        <input id="name" name="name" value={loginData.name} onChange={handleChange}
                          type="text"
                          className="pt-1 border-b-1 border-[#E6E6E6] text-[18px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="mail" className="text-[18px]">Nome</label>
                        <input id="mail" name="mail" value={loginData.mail} onChange={handleChange}
                          type="email"
                          className="pt-1 border-b-1 border-[#E6E6E6] text-[18px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="phone" className="text-[18px]">Celular</label>
                        <input id="phone" name="phone" value={loginData.phone} onChange={handleChange}
                          type="text"
                          className="pt-1 border-b-1 border-[#E6E6E6] text-[18px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="password" className="text-[18px]">Senha</label>
                        <input id="password" name="password" value={loginData.password} onChange={handleChange}
                          type="password"
                          className="pt-1 border-b-1 border-[#E6E6E6] text-[18px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-[5vw] py-0.5 bg-[#F37671] text-white rounded-[8px] text-[15px] cursor-pointer">
                      Salvar
                    </button>
                  </form>

                </div>
              )}

            </div>
          </section>
        </div>
      </div>
      <div className="flex justify-end">
        <img src={config_detail}
          alt=""
          className="h-screen" />
      </div>
    </div>
  )
}