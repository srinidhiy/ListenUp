import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";
import { getAlbumInfo } from "@/lib/spotify";
import Image from "next/image";
import AlbumCard from "@/components/cards/AlbumCard";

async function Page({ params}: {params: {id: string}}) {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding') 

    const album = await getAlbumInfo(params.id)

    return (
        <>
            <h1 className="head-text">Create Review for {album.name}</h1> 
            <AlbumCard
                    id={album.id}
                    name={album.name}
                    release_date={album.release_date}
                    artist={album.artists}
                    imgUrl={album.img_url}
                    card_type="search_result"
                    route_type="search"
            />
            <div className="my-2"></div>
            <PostThread userId = {userInfo._id} />
        </>
    )
}

export default Page;