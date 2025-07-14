import loadingLogo from "../assets/loading-logo.png";

export function LoadingSpinnerSmall() {
    return (
        <section className="flex flex-col items-center justify-center gap-10 h-screen">
            <div className="flex items-center justify-center">
                <img src="" alt="" className="w-30 animate-pulse
                sm:w-50
                md:w-50
                lg:w-50
                xl:w-50" />
            </div>
            <div className="flex flex-row">
                <div className="flex flex-row gap-1 items-end">
                    <div className="flex gap-[2px] text-[#303030] text-[25px] font-bold">
                        <h1>Carregando</h1>

                        <h1 className="animate-bounce [animation-delay:0s]">.</h1>
                        <h1 className="animate-bounce [animation-delay:0.5s]">.</h1>
                        <h1 className="animate-bounce [animation-delay:0s]">.</h1>
                    </div>

                </div>
            </div>
        </section>
    )
}