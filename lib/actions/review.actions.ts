"use server"

import Review from "../models/review.model";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { connectToDB } from "../mongoose"

import { revalidatePath } from "next/cache";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
    rating: number,
    albumId: string,
    album_name: string,
    album_artist: string,
    album_image: string,
}

export async function createReview({text, author, communityId, rating, albumId, album_name, album_artist, album_image, path}: Params) {
    try {
        connectToDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );
    
        const createdThread = await Review.create({
            text,
            author,
            community: communityIdObject,
            rating,
            albumId,
            album_name,
            album_artist,
            album_image,
        });

        // console.log(`Created time: ${createdThread.createdAt}`)

        // update user model - add thread to that specific user
        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id}
        })

        if (communityIdObject) {
            // Update Community model
            await Community.findByIdAndUpdate(communityIdObject, {
            $push: { threads: createdThread._id },
            });
        }
    

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // figuring out first post to show on the page - in case of pagination
    const skipAmount = (pageNumber - 1) * pageSize;
    const x = Thread.find({parentId: {$in: [null, undefined]}});
    x.exec();

    // fetch posts that have no parents - top level threads
    const postsQuery = Review.find({parentId: {$in: [null, undefined]}})
        .sort({ created: -1 })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path: "author", model: User})
        .populate({
            path: "community",
            model: Community,
          })
        .populate({
            path: "children", 
            populate: {
                path: "author",
                model: User,
                select: "_id name parentId image"
            }
        })

    const totalPosts = await Review.countDocuments({parentId: {$in: [null, undefined]}});

    const posts = await postsQuery.exec();

    const isNext = totalPosts > skipAmount + posts.length

    return {posts, isNext} 

}

export async function fetchReviewById(id: string) {
    connectToDB();

    try {

        const thread = await Review.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
              }) // Populate the community field with _id and name
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
                        model: Review,
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


export async function fetchReviewByAlbum(id: string) {
    connectToDB();

    try {

        const thread = await Review.find({albumId: id})
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
              }) // Populate the community field with _id and name
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
                        model: Review,
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

export async function addCommentToReview(threadId: string, commentText: string, userId: string, path: string) {
    connectToDB();
    try {
        // find original thread by id
        const originalThread = await Review.findById(threadId);
        if (!originalThread) {
            throw new Error("Thread not found");
        }
        // create new thread with comment text
        const commentThread = new Review({
            text: commentText,
            author: userId,
            parentId: threadId,
            album_name: "same album",
            album_artist: "same artist",
            album_image: "same image",
            rating: 0,
            albumId: "same id",
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

export async function fetchAllChildThreads(threadId: string): Promise<any[]> {
    const childThreads = await Review.find({ parentId: threadId });
  
    const descendantThreads = [];
    for (const childThread of childThreads) {
      const descendants = await fetchAllChildThreads(childThread._id);
      descendantThreads.push(childThread, ...descendants);
    }
  
    return descendantThreads;
  }

  export async function deleteReview(id: string, path: string): Promise<void> {
    try {
      connectToDB();
  
      // Find the thread to be deleted (the main thread)
      const mainThread = await Review.findById(id).populate("author community");
  
      if (!mainThread) {
        throw new Error("Thread not found");
      }
  
      // Fetch all child threads and their descendants recursively
      const descendantThreads = await fetchAllChildThreads(id);
  
      // Get all descendant thread IDs including the main thread ID and child thread IDs
      const descendantThreadIds = [
        id,
        ...descendantThreads.map((thread) => thread._id),
      ];
  
      // Extract the authorIds and communityIds to update User and Community models respectively
      const uniqueAuthorIds = new Set(
        [
          ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainThread.author?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
      const uniqueCommunityIds = new Set(
        [
          ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainThread.community?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
      // Recursively delete child threads and their descendants
      await Review.deleteMany({ _id: { $in: descendantThreadIds } });
  
      // Update User model
      await User.updateMany(
        { _id: { $in: Array.from(uniqueAuthorIds) } },
        { $pull: { threads: { $in: descendantThreadIds } } }
      );
  
      // Update Community model
      await Community.updateMany(
        { _id: { $in: Array.from(uniqueCommunityIds) } },
        { $pull: { threads: { $in: descendantThreadIds } } }
      );
  
      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to delete thread: ${error.message}`);
    }
  }
  
  

  