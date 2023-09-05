import { fetchReviewByAlbum } from "@/lib/actions/review.actions";
import { getAlbumInfo } from "@/lib/spotify";
import AlbumCard from "@/components/cards/AlbumCard";
import ThreadCard from "@/components/cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";

async function Page({ params}: {params: {id: string}}) {
    const user = await currentUser();
    const reviews = await fetchReviewByAlbum(params.id);
    const album = await getAlbumInfo(params.id)
    // console.log(averageRating);
    // console.log("REVIEWS: ", reviews)

    return (
        <section>
        <AlbumCard
            id={album.id}
            name={album.name}
            release_date={album.release_date}
            artist={album.artists}
            imgUrl={album.img_url}
            card_type="search_result"
            route_type="search"
        />
        <h1 className="mt-5 head-text">Reviews for {album.name} </h1>
        <div className="mt-9 gap-10 flex flex-col">
        {reviews.map((post) => (
            <ThreadCard
            key={post._id}
            id={post._id}
            currentUserId={user?.id || ""}
            parentId={post.parentId}
            content={post.text}
            author={post.author}
            community={post.community}
            createdAt={post.created}
            comments={post.children}
            albumId = {post.albumId}
            album_name={post.album_name}
            album_artist={post.album_artist}
            album_image={post.album_image}
            rating = {post.rating}
          />
        ))}
        </div>
        </section>
    )
}
export default Page;