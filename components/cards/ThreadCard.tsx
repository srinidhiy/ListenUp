import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { fetchUser } from "@/lib/actions/user.actions";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    isComment?: boolean;
    album_name: string;
    album_artist: string;
    album_image: string;
    rating: number;
    albumId: string;
}

const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,
    album_image,
    album_artist,
    album_name,
    rating,
    albumId,
}: Props) => {

    const starCharacter = '★'; 
    const starString = starCharacter.repeat(rating);
    
    return (
        <article className={`flex w-full flex-col rounded-xl  ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            {!isComment && (
                <div className='flex flex-wrap items-center gap-3'>
                <Link href={`/albums/${albumId}`} className='relative h-24 w-24'>
                  <Image
                    src={album_image}
                    alt='album_cover'
                    fill
                    // className='rounded-full object-cover'
                  />
                </Link>
    
                <div>
                
                <div className="star text-heading3-bold text-secondary-500">{'★'.repeat(rating)}</div>
                  <Link href={`/albums/${albumId}`}>
                    <h4 className='text-base-semibold text-light-1'>{album_name}</h4>
                  </Link>
                  <p className='text-small-medium text-gray-1'>{album_artist}</p>
                </div>
              </div>
            )}
            <div className="mt-6 flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image src={author.image} alt="Profile Image" fill className="cursor-pointer rounded-full" />
                        </Link>
                        <div className="thread-card_bar"/>
                    </div>

                    <div className="w-full flex flex-col ">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                        </Link>

                        <p className="mt-2 text-small-regular text-light-2">{content}</p>

                        <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                <Image src="/assets/heart-gray.svg" alt="heart" width={24} height={24} className="cursor-pointer object-contain"/>
                                <Link href={`/thread/${id}`} >
                                    <Image src="/assets/reply.svg" alt="reply" width={24} height={24} className="cursor-pointer object-contain"/>
                                </Link>
                                <Image src="/assets/repost.svg" alt="repost" width={24} height={24} className="cursor-pointer object-contain"/>
                                <Image src="/assets/share.svg" alt="share" width={24} height={24} className="cursor-pointer object-contain"/>
                            </div>

                            {!isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">
                                        {comments.length} replies
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>


            </div>
            <p className="mt-5 text-subtle-medium text-gray-1">
                {formatDateString(createdAt)}
            </p>
            {/* { !isComment && community && (
                <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
                    <p className="text-subtle-medium text-gray-1">
                        {formatDateString(createdAt)} - {community.name} Community
                    </p>
                    <Image src={community.image} alt={community.name} width={14} height={14} className="ml-1 rounded-full object-cover"/>
                </Link>
            )} */}
        </article>
    )

}

export default ThreadCard;