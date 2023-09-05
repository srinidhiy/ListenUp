import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";


interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType}: Props) => {
    let result: any;
    if (accountType === "Community") {
        result = await fetchCommunityPosts(accountId);
    } else {
        result = await fetchUserPosts(accountId);
    }

    if (!result) redirect("/")

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((post: any) => (
                <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={currentUserId || ""}
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
        </section>
    )
}

export default ThreadsTab;