//app/page.tsx
import { UserButton } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/review.actions";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";
import { getNewReleases } from "@/lib/spotify";
import AlbumCard from "@/components/cards/AlbumCard";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  const newReleases = await getNewReleases();
  // console.log(newReleases);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <h3 className="mt-5 text-heading4-medium text-left text-light-2">New Releases</h3>
      <section>
        <div className="mt-5 gap-10 flex overflow-x-auto">
        {newReleases.map((album) => (
          <AlbumCard
            id={album.id}
            name={album.name}
            release_date={album.release_date}
            artist={album.artists}
            imgUrl={album.img_url}
            card_type="regular"
            route_type="none"
            />
        ))}
        </div>
      <h3 className="mt-5 text-heading4-medium text-left text-light-2">Recent Reviews</h3>
      </section>
      <section className="mt-9 gap-10 flex flex-col">
        {result.posts.length === 0 ? (
          <p className="no-result">No posts found</p>
        ) : (
          <>
            {result.posts.map((post) => (
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
          </>
        )}
      </section>
    </>
  )
}