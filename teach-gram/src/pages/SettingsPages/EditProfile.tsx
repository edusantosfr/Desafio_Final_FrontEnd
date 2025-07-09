import back_button from "../../assets/backButton.png";
import config_detail from "../../assets/config-detail.png";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { patchUserEdit } from "../../services/user.service";
import { getLogedUser } from "../../services/user.service";
import { useUser } from "../../context/UserContext";

export function EditProfile() {
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
    profileLink: '',
    name: '',
    username: '',
    description: ''
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
      const user = await patchUserEdit(editUserData);

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
              onClick={() => navigate("/Settings/Menu")}
              className="cursor-pointer">
              <img src={back_button} alt="Voltar" className="h-[3vh]" />
            </button>
          </section>
          <section className="flex justify-center items-center">
            <div className="w-[80%] h-[100%] flex flex-col gap-12">
              {status ? (
                <LoadingSpinnerSmall />
              ) : (
                <div className="flex flex-col gap-10">
                  <div
                    className="w-[25vw] flex items-center justify-between">
                    <h1 className="text-[25px] font-semibold text-[#303030]">Editar Perfil</h1>
                  </div>

                  <img
                    className="rounded-full object-cover aspect-square w-40 h-40"
                    src={editUserData.profileLink}
                    alt="foto de perfil" />

                  <form onSubmit={handleEditProfile} className="flex flex-col w-full gap-10">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="profileLink" className="text-[18px]">Foto de perfil</label>
                        <input id="profileLink" name="profileLink" value={editUserData.profileLink} onChange={handleChange}
                          type="url"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[18px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="name" className="text-[18px]">Nome</label>
                        <input id="name" name="name" value={editUserData.name} onChange={handleChange}
                          type="text"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[18px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="username" className="text-[18px]">Nome de Usuário</label>
                        <input id="username" name="username" value={editUserData.username} onChange={handleChange}
                          type="text"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[18px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                        />
                      </div>

                      <div className="flex flex-col w-full max-w-xs gap-1">
                        <label htmlFor="description" className="text-[18px]">Bio</label>
                        <input id="description" name="description" value={editUserData.description} onChange={handleChange}
                          type="text"
                          className="truncate pt-1 border-b-1 border-[#E6E6E6] text-[18px] text-[#717171] focus:text-[#F37671] focus:outline-none focus:border-[#F37671]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <button
                        onClick={() => navigate("/Settings/Menu")}
                        className="w-[5vw] py-0.5 rounded-[8px] text-[15px] border-[#F37671] border-1 text-[#F37671] cursor-pointer">
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-[5vw] py-0.5 bg-[#F37671] text-white rounded-[8px] text-[15px] cursor-pointer">
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
      <div className="flex justify-end">
        <img src={config_detail}
          alt=""
          className="h-screen" />
      </div>
    </div>
  )
}