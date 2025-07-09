import back_button from "../../assets/backButton.png";
import config_detail from "../../assets/config-detail.png";

import { useNavigate } from "react-router-dom";

export function EditProfile() {
const navigate = useNavigate();

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
          <div className="flex justify-center items-center">
            <section className="w-[80%] h-[90%] flex flex-col gap-12">

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
  )
}