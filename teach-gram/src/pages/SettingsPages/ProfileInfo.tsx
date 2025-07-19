import back_button from "../../assets/backButton.png";
import config_detail from "../../assets/config-detail.png";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { getLogedUser } from "../../services/user.service";
import { patchUserInfo } from "../../services/user.service";
import { useUser } from "../../context/UserContext";

export function ProfileInfo() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [status, setStatus] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });

    const { name, value } = e.target;
    setEditUserData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const [editUserData, setEditUserData] = useState({
    name: '',
    mail: '',
    phone: '',
    password: ''
  })

  useEffect(() => {
    const handleLogedUser = async () => {
      setStatus(true);

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

        setEditUserData(user);

      } catch (error) {
        console.error("Erro ao fazer a edição:", error);
      } finally {
        setStatus(false);
      }
    }
    handleLogedUser();
  }, []);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(true);

    try {
      const res = await patchUserInfo(editUserData);

      localStorage.clear();
      localStorage.setItem('token', res.token);

      const user = res.user;

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
    <div className="w-full grid grid-cols-[100vw]
      sm:grid-cols-[100vw]
      md:grid-cols-[55vw_45vw]
      lg:grid-cols-[60vw_40vw]
      xl:grid-cols-[75vw_25vw]">
      <div className="flex justify-center">
        <div className="grid grid-rows-[8vh_92vh] w-[88%] 
        sm:grid-rows-[5vh_95vh]
        md:grid-rows-[15vh_85vh]
        lg:grid-rows-[15vh_85vh]
        xl:grid-rows-[15vh_85vh]">
          <section className="flex flex-row gap-5 items-center">
            <button
              type="button"
              onClick={() => navigate("/Settings/Menu")}
              className="cursor-pointer">
              <img src={back_button} alt="Voltar" className="h-[3vh] hidden
              sm:h-[2.5vh] sm:hidden
              md:h-[2.5vh] md:block
              lg:h-[3vh] lg:block
              xl:h-[3vh] xl:block" />
            </button>
          </section>
          <section className="flex justify-center items-center">
            <div className="w-[90%] h-[90%] flex flex-col gap-12
            sm:w-[80%]
            md:w-[80%]
            lg:w-[80%]
            xl:w-[80%]">
              {status ? (
                <LoadingSpinnerSmall />
              ) : (
                <div className="flex flex-col gap-15
                sm:gap-20
                md:gap-10
                lg:gap-10
                xl:gap-10">
                  <div
                    className="w-full flex items-center justify-between">
                    <h1 className="text-[19px] font-semibold text-[#303030]
                    sm:text-[24px] 
                    md:text-[24px] 
                    lg:text-[22px] 
                    xl:text-[24px] ">Configurações de Conta</h1>
                  </div>

                  <form onSubmit={handleEditProfile} className="flex flex-col w-full gap-10">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col w-full max-w-xs gap-0
                      sm:gap-1
                      md:gap-1
                      lg:gap-1
                      xl:gap-1">
                        <label htmlFor="name" className="text-[14px]
                        sm:text-[18px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[18px]">Nome</label>
                        <input id="name" name="name" value={editUserData.name} onChange={handleChange}
                          type="text"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671] text-[15px]
                        sm:text-[18px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[18px]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-0
                      sm:gap-1
                      md:gap-1
                      lg:gap-1
                      xl:gap-1">
                        <label htmlFor="mail" className="text-[14px]
                        sm:text-[18px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[18px]">Email</label>
                        <input id="mail" name="mail" value={editUserData.mail} onChange={handleChange}
                          type="email"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671] text-[15px]
                        sm:text-[18px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[18px]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-0
                      sm:gap-1
                      md:gap-1
                      lg:gap-1
                      xl:gap-1">
                        <label htmlFor="phone" className="text-[14px]
                        sm:text-[18px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[18px]">Celular</label>
                        <input id="phone" name="phone" value={editUserData.phone} onChange={handleChange}
                          type="text"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671] text-[15px]
                        sm:text-[18px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[18px]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-0
                      sm:gap-1
                      md:gap-1
                      lg:gap-1
                      xl:gap-1">
                        <label htmlFor="password" className="text-[14px]
                        sm:text-[18px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[18px]">Senha</label>
                        <input id="password" name="password" value={editUserData.password} onChange={handleChange}
                          type="password"
                          placeholder="Digite aqui a senha nova"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671] text-[15px]
                        sm:text-[18px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[18px]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 
                    sm:gap-4
                    md:gap-6
                    lg:gap-6
                    xl:gap-6">
                      <button
                        type="button"
                        onClick={() => navigate("/Settings/Menu")}
                        className="w-20 py-0.5 rounded-[8px] text-[14px] border-[#F37671] border-1 text-[#F37671] cursor-pointer block
                        sm:block sm:text-[15px] sm:py-1
                        md:hidden md:text-[15px] md:py-1
                        lg:hidden lg:text-[15px] lg:py-1
                        xl:hidden xl:text-[15px] xl:py-1">
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-20 py-0.5 bg-[#F37671] text-white rounded-[8px] text-[14px] cursor-pointer
                        sm:text-[15px] sm:py-1
                        md:text-[15px] md:py-1
                        lg:text-[15px] lg:py-1
                        xl:text-[15px] xl:py-1">
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </section>
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
  )
}