import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import { searchAlbums } from "@/lib/spotify";
import AlbumCard from "@/components/cards/AlbumCard";

async function Page({ searchParams }: {searchParams: {[key: string]: string | undefined}}) {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding') 
    var albums = null;
    if (searchParams.q) {
        albums = await searchAlbums(searchParams.q)
    }

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            <Searchbar />

            <section>
                <div className="mt-5 gap-10">
                {albums && albums.map((album) => (
                <AlbumCard
                    id={album.id}
                    name={album.name}
                    release_date={album.release_date}
                    artist={album.artists}
                    imgUrl={album.img_url}
                    card_type="search_result"
                    />
                ))}
                </div>
            </section>

        </section>
    )
}

export default Page;