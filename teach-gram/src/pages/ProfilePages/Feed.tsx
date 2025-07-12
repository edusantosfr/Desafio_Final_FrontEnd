import config_detail from "../../assets/config-detail.png";

import { Post } from "../Post";

export function Feed() {
  return (
    <div className="grid grid-cols-[1fr_300px] h-full">
      <div className="overflow-y-auto h-screen p-20 pt-45">

        <Post/>

      </div>
      <aside className="sticky top-0 self-start h-screen">
        <section className="flex items-center justify-end">
          <img src={config_detail} alt="login imagem" className=" h-screen" />
        </section>
      </aside>
    </div>
  )
}