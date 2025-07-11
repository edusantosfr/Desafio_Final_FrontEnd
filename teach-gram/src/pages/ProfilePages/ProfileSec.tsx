import no_profile from "../../assets/no-profile.png";

import { useState, useEffect } from "react";

import { LoadingSpinnerSmall } from "../../components/loadingSpinnerSmall";
import { getLogedUser } from "../../services/user.service";
import { getAllMyPosts } from "../../services/post.service";

export function ProfileSec() {
  const [status, setStatus] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const [user, setUser] = useState({
    id: '',
    name: '',
    username: '',
    phone: '',
    mail: '',
    profileLink: '',
    description: ''
  })

  type Post = {
    id: number;
    title: string;
    description: string;
    photoLink: string;
    videoLink: string;
  };

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

      } catch (error) {
        console.error("Erro ao fazer a edição:", error);
      } finally {
        setStatus(false);
      }
    }
    handleLogedUser();


    const handlePosts = async () => {
      try {
        const data = await getAllMyPosts();
        setPosts(data);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    };
    handlePosts();
  }, []);

  return (
    <div className="w-[1000px]">
      {status ? (
        <LoadingSpinnerSmall />
      ) : (
        <div className="grid grid-rows-[auto_auto] justify-center w-full">
          <section className="flex py-[60px] gap-20 w-full max-w-screen-lg mx-auto">
            <img className="rounded-full object-cover aspect-square w-70 h-70"
              src={user.profileLink || no_profile}
              alt="foto de perfil" />

            <div className="flex flex-col pt-10 gap-4 max-w-[650px]">
              <h1 className="capitalize text-[25px] font-semibold text-[#303030] break-words">{user.name}</h1>

              <div className="text-[20px] text-[#6b6b6b] font-light w-full h-fit break-words">{user.description}</div>
            </div>
          </section>

          <section className="flex flex-col items-center gap-5">
            <div className="flex">
              <div className="flex flex-col items-center">
                <h1 className="capitalize text-[20px] font-semibold text-[#303030]">{posts.length}</h1>
                <p className="text-[20px] text-[#6b6b6b] font-light">Posts</p>
              </div>

              <div className="mt-1 w-[1px] h-10 bg-[#DBDADA] mx-10"></div>

              <div className="flex flex-col items-center">
                <h1 className="capitalize text-[20px] font-semibold text-[#303030]">100</h1>
                <p className="text-[20px] text-[#6b6b6b] font-light">Amigos</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {posts.map(post => (
                <div key={post.id}
                  className="cursor-pointer">
                  <img src={post.photoLink}
                    alt="Imagem de Post"
                    className="object-cover aspect-square" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}