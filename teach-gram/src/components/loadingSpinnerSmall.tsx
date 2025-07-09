import loadingLogo from "../assets/loading-logo.png";

export function LoadingSpinnerSmall() {
    return (
        <section className="flex flex-col items-center justify-center gap-10 h-screen">
            <div className="flex items-center justify-center">
                <img src={loadingLogo} alt="" className="w-50 animate-pulse" />
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