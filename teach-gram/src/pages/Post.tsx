import post_hamburguer from "../assets/post-hamburguer.png";
import like_button from "../assets/like-button.png";

export function Post() {
    return (
        <div className="h-fit flex flex-col gap-15">
            <div className="h-fit w-[550px] bg-white rounded-[18px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.2)] flex flex-col">
                <div className="flex h-fit w-full justify-between items-start">
                    <section className="flex gap-8 w-full max-w-screen-lg mx-auto items-center">
                        <img className="rounded-full object-cover aspect-square w-22 h-22 cursor-pointer"
                            src="https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                            alt="foto de perfil" />

                        <div className="flex flex-col max-w-[650px]">
                            <h1 className="capitalize text-[25px] font-light text-[#8E8E8E] break-words cursor-pointer">@Username</h1>

                            <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[340px] h-fit break-words">há 5 min</div>
                        </div>
                    </section>
                    <button className="cursor-pointer">
                        <img className="h-7"
                            src={post_hamburguer}
                            alt="hamburguer" />
                    </button>
                </div>
                <div className="flex flex-col mt-5 gap-5">
                    <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words">fsdfdsf</div>

                    <img className="object-cover w-full h-full cursor-pointer rounded-[8px]"
                        src="https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt="foto de perfil" />

                    <div className="flex items-center gap-5">
                        <button className="cursor-pointer">
                            <img className="h-10"
                                src={like_button}
                                alt="botão de curtida" />
                        </button>
                        <div className="text-[20px] text-[#8E8E8E] font-light w-full max-w-[480px] h-fit break-words">20 curtidas</div>
                    </div>

                </div>
            </div>
        </div>
    )
}