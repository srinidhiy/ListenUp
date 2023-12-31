"use client"

import { CommentValidation } from "@/lib/validations/thread";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Input } from "@/components/ui/input"
// import { createThread } from "@/lib/actions/thread.actions";
import Thread from "@/lib/models/thread.model";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
// import { addCommentToThread } from "@/lib/actions/thread.actions";
import { addCommentToReview } from "@/lib/actions/review.actions";

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({ threadId, currentUserImg ,currentUserId}: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            // image:  "",
            text: "",
        }
    });

    const onSubmit = async(values: z.infer<typeof CommentValidation >) => {
        await addCommentToReview(threadId, values.text, JSON.parse(currentUserId), pathname);
        form.reset();
    }

    return (
        <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form">
            <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
                <FormItem className="flex items-center gap-3 w-full">
                <FormLabel>
                    <Image src={currentUserImg} alt="Profile Image" width={48} height={48} className="rounded-full object-cover" />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                    <Input 
                    type="text"
                    placeholder="Comment..."
                    className="no-focus text-light-1 outline-none"
                    {...field}
                    />
                </FormControl>
                </FormItem>
            )}
            />
            <Button type="submit" className='comment-form_btn'>Reply</Button>
        </form>
        </Form>

    )
}

export default Comment;