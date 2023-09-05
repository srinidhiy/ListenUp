"use client"

import { ThreadValidation } from "@/lib/validations/thread";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent } from 'react';
// import { useState } from "react";
// import { useUploadThing } from "@/lib/validations/uploadthing";
import * as z from 'zod';
import { isBase64Image } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { createReview } from "@/lib/actions/review.actions";
import Review from "@/lib/models/review.model";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { useState } from "react";

interface Params {
    userId: string,
    albumId: string,
    album_name: string,
    album_artist: string,
    album_image: string,
}

function PostThread({userId, albumId, album_name, album_artist, album_image}: Params) {
    // const [files, setFiles] = useState<File[]>([])
    // const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);

    const handleMouseOver = (rating: number) => {
        setHoveredRating(rating);
    };

    const handleMouseOut = () => {
        setHoveredRating(0);
    };

    const handleClick = (rating: number) => {
        if (selectedRating === rating) {
        setSelectedRating(0); // Deselect if the same rating is clicked again
        } else {
        setSelectedRating(rating);
        }
    };

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            // image:  "",
            text: "",
            accountId: userId,
            rating: 0,
            albumId: albumId,
            album_name: "",
            album_artist: "",
            album_image: ""
        }
    });

    const onSubmit = async(values: z.infer<typeof ThreadValidation >) => {
        await createReview({
            text: values.text,
            author: userId,
            communityId: organization ? organization.id : null,
            albumId: albumId,
            rating: selectedRating,
            album_name: album_name,
            album_artist: album_artist,
            album_image: album_image,
            path: pathname
        });

         router.push('/');
    }

    return (
        
        <Form {...form}>
        <div className="star-rating flex items-center">
        {[1, 2, 3, 4, 5].map((rating) => (
            <span
            key={rating}
            className={`star text-heading1-bold ${
                (hoveredRating >= rating || selectedRating >= rating) ? 'text-secondary-500' : 'text-gray-400'
            }`}
            onMouseOver={() => handleMouseOver(rating)}
            onMouseOut={handleMouseOut}
            onClick={() => handleClick(rating)}
            >
            &#9733;
            </span>
        ))}
        <p className="ml-2 text-light-1">Selected Rating: {selectedRating}</p>
        </div>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col justify-start gap-10">
            <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
                <FormItem className="flex flex-col gap-3 w-full my-5">
                {/* <FormLabel className="text-base-semibold text-light-2">
                    Content
                </FormLabel> */}
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                    <Textarea 
                    rows={10}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className='bg-primary-500'>Post Review</Button>
        </form>
        </Form>

    )
}

export default PostThread;