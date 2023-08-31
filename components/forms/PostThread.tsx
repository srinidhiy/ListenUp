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
import { useOrganization } from "@clerk/nextjs";



function PostThread({userId}: {userId: string}) {
    // const [files, setFiles] = useState<File[]>([])
    // const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

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
            communityId: organization ? organization.id : null,
            path: pathname
        });

         router.push('/');
    }

    return (
        <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col justify-start gap-10">
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
            <Button type="submit" className='bg-primary-500'>Post Review</Button>
        </form>
        </Form>

    )
}

export default PostThread;