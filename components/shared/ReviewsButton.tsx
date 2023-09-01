"use client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

interface Props {
    id: string;
}

function ReviewsButton({id}: Props) {
    const router = useRouter();
    return (
        <div className="mx-7 flex flex-col w-full rounded-lg bg-dark-3 px-4 py-5 sm:w-72">
            <h3 className="text-heading4-medium text-left text-light-2">See all reviews for this project!</h3>
            <hr className="h-px my-2 bg-gray-500 border-0"/>
            <Button className="mt-5 user-card_btn" onClick = {() => router.push(`/reviews/${id}`)}>
                View
            </Button>
        </div>
    )
}

export default ReviewsButton;