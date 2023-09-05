import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
   text: {type: String, required: true},
   author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
   },
   community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
   },
   created: {
    type: Date,
    default: Date.now,
   },
   parentId: {
    type: String
   },
   children: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },
   ],
   rating: {type: Number, required: true},
   albumId: {type: String, required: true},
   album_name: {type: String, required: true},
   album_artist: {type: String, required: true},
   album_image: {type: String, required: true},
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema );
export default Review;
