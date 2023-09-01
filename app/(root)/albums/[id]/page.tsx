import { currentUser } from "@clerk/nextjs";
import { getAlbumInfo } from "@/lib/spotify";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import PostThread from "@/components/forms/PostThread";
import { Button } from "@/components/ui/button";
import ReviewsButton from "@/components/shared/ReviewsButton";
 
async function Page({ params}: {params: {id: string}}) {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding') 

    const album = await getAlbumInfo(params.id)
    return (
        <section>
            <h1 className="head-text text-left">{album.name}</h1>
            <h3 className="text-heading4-medium text-left text-light-2">{album.artists}</h3>
            <div className="mt-5 relative flex">
                <Image
                    src={album.img_url}
                    alt="Album cover"
                    height={176}
                    width={176}
                />
                <div className="ml-7 flex flex-col w-full rounded-lg bg-dark-3 px-4 py-5 sm:w-72">
                    <h3 className="text-heading4-medium text-left text-light-2">Album details</h3>
                    <hr className="h-px my-2 bg-gray-500 border-0"/>
                    <h3 className="py-1 text-4xl text-left text-light-2">Release date: {album.release_date}</h3>
                    <h3 className="py-1 text-4xl text-left text-light-2">Total runtime: {album.total_runtime}</h3>
                    <h3 className="py-1 text-4xl text-left text-light-2">Rating: No reviews yet</h3>
                </div>
                <ReviewsButton id={params.id} />
            </div>
        
        <div className="flex">
          <div className="mt-10 flex flex-col w-full rounded-lg bg-dark-3 px-4 py-5 sm:w-96">
            <h3 className="text-heading4-medium text-left text-light-2">Tracklist</h3>
            <hr className="h-px my-2 bg-gray-500 border-0"/>
            {album.tracks.map((track) => (
                <div className="flex justify-between">
                    <div className="flex">
                        <h3 className=" text-light-2">{track.track_number + "."}</h3>
                        <a href={track.preview_url} className="text-4xl text-light-2">{track.name}</a>
                    </div>
                    <h3 className="text-subtle-semibold text-light-2 py-1.5" >{track.duration}</h3>
                </div>
            ))}
          </div>

            <div className="mt-10 ml-10 flex flex-col w-full rounded-lg bg-dark-3 px-4 py-5 sm:w-96">
                <h3 className="text-heading4-medium text-left text-light-2">Rate and Review:</h3>
                <hr className="h-px my-2 bg-gray-500 border-0"/>
                <PostThread userId={userInfo._id} />
            </div>
        </div>
        

        </section>
    )
}

export default Page;