import config_detail from "../../assets/config-detail.png";
import post_hamburguer from "../../assets/post-hamburguer.png";

export function Feed() {
  return (
    <div className="grid grid-cols-[1fr_300px] h-full">
      <div className="overflow-y-auto h-screen p-20 pt-45">
        <div className="h-fit flex flex-col gap-15">
          <div className="h-[550px] w-[550px] rounded-[18px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
            <div className="flex bg-white h-full w-full justify-between items-start">
              <section className="flex gap-8 w-full max-w-screen-lg mx-auto items-center">
                <img className="rounded-full object-cover aspect-square w-22 h-22"
                  src="https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  alt="foto de perfil" />

                <div className="flex flex-col max-w-[650px]">
                  <h1 className="capitalize text-[25px] font-light text-[#8E8E8E] break-words">@Username</h1>

                  <div className="text-[20px] text-[#8E8E8E] font-light w-full h-fit break-words">há 5 min</div>
                </div>
              </section>
              <button>
                <img className="h-7"
                  src={post_hamburguer}
                  alt="hamburguer" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <aside className="sticky top-0 self-start h-screen">
        <section className="flex items-center justify-end">
          <img src={config_detail} alt="login imagem" className=" h-screen" />
        </section>
      </aside>
    </div>
  )
}