"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface Props {
  id: string;
  artist: string;
  imgUrl: string;
  release_date: string;
  name: string;
  card_type: string;
}


// flex flex-col justify-between gap-4 max-xs:rounded-xl max-xs:bg-dark-3 max-xs:p-4 xs:flex-row xs:items-center

function AlbumCard({ id, name, artist, imgUrl, release_date, card_type }: Props) {
  const router = useRouter();

  return (
    
      <article className='community-card flex justify-between w-full mt-5'>
        <div>
          <div className='flex flex-wrap items-center gap-3'>
            <Link href={`/albums/${id}`} className='relative h-36 w-36'>
              <Image
                src={imgUrl}
                alt='album_cover'
                fill
                // className='rounded-full object-cover'
              />
            </Link>

            <div>
              <Link href={`/albums/${id}`}>
                <h4 className='text-base-semibold text-light-1'>{name}</h4>
              </Link>
              <p className='text-small-medium text-gray-1'>{artist}</p>
              <p className='text-small-medium text-gray-1'>{release_date}</p>
            </div>
          </div>
        </div>
        {card_type === "search_result" && (
        <Button className="user-card_btn" onClick = {() => router.push(`/albums/${id}`)}>
          View
        </Button>
        )
        }
      </article>
 
  );
}

export default AlbumCard;