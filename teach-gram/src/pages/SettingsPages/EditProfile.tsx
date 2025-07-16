import back_button from "../../assets/backButton.png";
import config_detail from "../../assets/config-detail.png";
import no_profile from "../../assets/no-profile.png";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { patchUserEdit } from "../../services/user.service";
import { getLogedUser } from "../../services/user.service";

export function EditProfile() {
  const navigate = useNavigate();
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
    profileLink: '',
    name: '',
    username: '',
    description: ''
  })

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(true);

    try {
      await patchUserEdit(editUserData);

      navigate('/Settings/Menu');

    } catch (error) {
      console.error("Erro ao fazer a edição:", error);
    } finally {
      setStatus(false);
    }
  }

  useEffect(() => {
    const handleLogedUser = async () => {
      setStatus(true);

      try {
        const user = await getLogedUser();

        setEditUserData(user);

      } catch (error) {
        console.error("Erro ao fazer a edição:", error);
      } finally {
        setStatus(false);
      }
    }
    handleLogedUser();
  }, [])

  return (
    <div className="w-full grid grid-cols-[100vw]
    sm:grid-cols-[100vw]
    md:grid-cols-[55vw_45vw]
    lg:grid-cols-[60vw_40vw]
    xl:grid-cols-[75vw_25vw]">
      <div className="flex justify-center">
        <div className="grid grid-rows-[8vh_92vh] w-[85%] 
        sm:grid-rows-[10vh_90vh]
        md:grid-rows-[15vh_85vh]
        lg:grid-rows-[13vh_87vh]
        xl:grid-rows-[13vh_87vh]">
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
            <div className="w-[90%] h-[100%] flex flex-col gap-12
            sm:w-[80%]
            md:w-[80%]
            lg:w-[80%]
            xl:w-[80%]">
              {status ? (
                <LoadingSpinnerSmall />
              ) : (
                <div className="flex flex-col gap-7
                sm:gap-10
                md:gap-10
                lg:gap-8
                xl:gap-7">
                  <div
                    className="w-full flex items-center justify-between">
                    <h1 className="text-[19px] font-semibold text-[#303030]
                    sm:text-[25px]
                    md:text-[25px]
                    lg:text-[22px]
                    xl:text-[24px]">Editar Perfil</h1>
                  </div>

                  <img
                    className="rounded-full object-cover aspect-square w-30 h-30
                    sm:w-40 sm:h-40
                    md:w-40 md:h-40
                    lg:w-40 lg:h-40
                    xl:w-40 xl:h-40"
                    src={editUserData.profileLink || no_profile}
                    alt="foto de perfil" />

                  <form onSubmit={handleEditProfile} className="flex flex-col w-full gap-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="profileLink" className="text-[14px]
                        sm:text-[16px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[16px]">Foto de perfil</label>
                        <input id="profileLink" name="profileLink" value={editUserData.profileLink} onChange={handleChange}
                          type="url"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                          sm:text-[16px]
                          md:text-[18px]
                          lg:text-[16px]
                          xl:text-[16px]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="name" className="text-[14px]
                        sm:text-[16px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[16px]">Nome</label>
                        <input id="name" name="name" value={editUserData.name} onChange={handleChange}
                          type="text"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                          sm:text-[16px]
                          md:text-[18px]
                          lg:text-[16px]
                          xl:text-[16px]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="username" className="text-[14px]
                        sm:text-[16px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[16px]">Nome de Usuário</label>
                        <input id="username" name="username" value={editUserData.username} onChange={handleChange}
                          type="text"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                          sm:text-[16px]
                          md:text-[18px]
                          lg:text-[16px]
                          xl:text-[16px]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="description" className="text-[14px]
                        sm:text-[16px]
                        md:text-[18px]
                        lg:text-[16px]
                        xl:text-[16px]">Bio</label>
                        <input id="description" name="description" value={editUserData.description} onChange={handleChange}
                          type="text"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[15px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]
                          sm:text-[16px]
                          md:text-[18px]
                          lg:text-[16px]
                          xl:text-[16px]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4
                    sm:gap-4
                    md:gap-6
                    lg:gap-6
                    xl:gap-6">
                      <button
                        onClick={() => navigate("/Settings/Menu")}
                        className="w-20 py-0.5 rounded-[8px] text-[14px] border-[#F37671] border-1 text-[#F37671] cursor-pointer
                        sm:text-[15px]
                        md:text-[15px]
                        lg:text-[15px]
                        xl:text-[15px]">
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-20 py-0.5 bg-[#F37671] text-white rounded-[8px] text-[14px] cursor-pointer
                        sm:text-[15px] sm:py-1
                        md:text-[15px] md:py-1
                        lg:text-[15px] lg:py-1
                        xl:text-[15px] xl:py-1">
                        Atualizar
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