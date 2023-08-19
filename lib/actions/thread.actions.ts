"use server"

import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({text, author, communityId, path}: Params) {
    connectToDB();
    const createdThread = await Thread.create({
        text,
        author,
        community: null,
    });

    // console.log(`Created time: ${createdThread.createdAt}`)

    // update user model - add thread to that specific user
    await User.findByIdAndUpdate(author, {
        $push: {threads: createdThread._id}
    })

    revalidatePath(path);
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // figuring out first post to show on the page - in case of pagination
    const skipAmount = (pageNumber - 1) * pageSize;


    // fetch posts that have no parents - top level threads
    const postsQuery = Thread.find({parentId: {$in: [null, undefined]}})
        .sort({ created: -1 })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path: "author", model: User})
        .populate({
            path: "children", 
            populate: {
                path: "author",
                model: User,
                select: "_id name parentId image"
            }
        })

    const totalPosts = await Thread.countDocuments({parentId: {$in: [null, undefined]}});

    const posts = await postsQuery.exec();

    const isNext = totalPosts > skipAmount + posts.length

    return {posts, isNext} 

}

export async function fetchThreadById(id: string) {
    connectToDB();

    try {

        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    // have to get comments that are replies to comments as well
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

            return thread;

    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`);
    }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
    connectToDB();
    try {
        // find original thread by id
        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error("Thread not found");
        }
        // create new thread with comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })
        // save new thread to database
        const savedCommentThread = await commentThread.save();
        // update original thread to include new comment
        originalThread.children.push(savedCommentThread._id);
        await originalThread.save();

        revalidatePath(path);

    } catch(error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}