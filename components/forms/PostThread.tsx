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
import { createThread } from "@/lib/actions/thread.actions";
import Thread from "@/lib/models/thread.model";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";



function PostThread({userId}: {userId: string}) {
    // const [files, setFiles] = useState<File[]>([])
    // const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            // image:  "",
            text: "",
            accountId: userId,
        }
    });

    const onSubmit = async(values: z.infer<typeof ThreadValidation >) => {
         await createThread({
            text: values.text,
            author: userId,
            communityId: null,
            path: pathname
         });

         router.push('/');
    }

    /*
        If I want to do image uploads for threads in the future
    */
    // const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    //     e.preventDefault();

    //     const fileReader = new FileReader();
    //     if (e.target.files && e.target.files.length) {
    //         const file = e.target.files[0];
    //         setFiles(Array.from(e.target.files));
    //         if (!file.type.includes('image')) return;

    //         fileReader.onload = async (event) => {
    //             const imageDataUrl = event.target?.result?.toString() || "";

    //             fieldChange(imageDataUrl);
    //         }

    //         fileReader.readAsDataURL(file);
    //     }
    // }

    // const onSubmit = async(values: z.infer<typeof ThreadValidation>) => {
    //     const blob = values.image;
    //     const hasImageChanged = isBase64Image(blob);
    //     // upload to uploadthing
    //     if (hasImageChanged) {
    //         const imgRes = await startUpload(files)
    //         if (imgRes && imgRes[0].fileUrl) {
    //             values.image = imgRes[0].fileUrl;
    //         }
    //     }
    //     // update thread object
        
    //   }


    return (
        <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col justify-start gap-10">
            {/* <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                    {field.value ? (
                        <Image src={field.value} alt="profile photo" width={96} height={96} priority className="rounded-full object-contain"/>
                    ) : (
                        <Image src="/assets/profile.svg" alt="profile photo" width={24} height={24} className="object-contain"/>
                    )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                    <Input 
                    type="file" 
                    accept="image/*" 
                    placeholder="Upload a photo" 
                    className="account-form_image-input" 
                    onChange={(e) => handleImage(e, field.onChange)} 
                    />
                </FormControl>
                </FormItem>
            )}
            /> */}

            <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
                <FormItem className="flex flex-col gap-3 w-full my-5">
                <FormLabel className="text-base-semibold text-light-2">
                    Content
                </FormLabel>
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
            <Button type="submit" className='bg-primary-500'>Post Thread</Button>
        </form>
        </Form>

    )
}

export default PostThread;