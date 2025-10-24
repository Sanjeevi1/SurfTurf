import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

// Rating component to display stars
const Rating = ({ rating, showLabel, className, ...rest }) => (
    <p className={`text-sm mb-4 ${className}`} {...rest}>
        <span className="text-yellow-500">
            {[...Array(rating)].map((_, i) => {
                const index = i + 1;
                let content = "";
                if (index <= Math.floor(rating)) content = <FontAwesomeIcon icon={faStar} />;
                else if (rating > i && rating < index + 1) content = <FontAwesomeIcon icon={faStarHalfAlt} />;
                else content = <FontAwesomeIcon icon={faStar} />;
                return <React.Fragment key={i}>{content}</React.Fragment>;
            })}
        </span>
        {showLabel && <span className="mx-1">{rating.toFixed(1)}</span>}
    </p>
);

import axios from "axios";
// Review item component
const ReviewItem = ({ item }) => {
    const [likes, setLikes] = useState(item.like);
    const [dislikes, setDislikes] = useState(item.dislike);
    console.log(item)
    const handleLike = async () => {
        try {
            const response = await axios.post(`/api/review/${item._id}`, { action: 'like' });
            setLikes(response.data.data.like);
        } catch (error) {
            console.error("Error liking the review:", error);
        }
    };

    const handleDislike = async () => {
        try {
            const response = await axios.post(`/api/review/${item._id}`, { action: 'dislike' });
            setDislikes(response.data.data.dislike);
        } catch (error) {
            console.error("Error disliking the review:", error);
        }
    };
    return (
        <div className="my-5">
            <hr className="dark:border-slate-700 my-5" />
            <div className="flex flex-col lg:flex-row justify-between">
                <div className="w-full lg:w-1/3">
                    <div>{item.user?.username || 'Anonymous User'}</div>
                    <div className="flex mb-6">
                        <div>
                            <h5 className="font-medium my-1">{item.user?.name || 'Anonymous'}</h5>
                            <Rating rating={item.rating} showLabel={true} />
                            <p className="font-semibold mb-0"> <>{item.comment}</></p>
                            <p className="opacity-50 mb-0 text-sm">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/3">
                    <p className="text-sm leading-normal opacity-75 mb-6">{item.content}</p>
                    <div className="flex justify-end">
                        <button className="hover:text-yellow-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded inline-flex justify-center items-center duration-300 px-3 py-2 mr-6">
                            <FontAwesomeIcon icon={faThumbsUp} className="text-lg mr-2" onClick={handleLike} />
                            Like ({likes})
                        </button>
                        <button className="hover:text-yellow-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded inline-flex justify-center items-center duration-300 px-3 py-2">
                            <FontAwesomeIcon icon={faThumbsDown} className="text-lg mr-2" onClick={handleDislike} />
                            Dislike ({dislikes})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Form component for adding a new review
const ReviewForm = ({ onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, comment });
        onClose(); // Close the form after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white w-1/3 p-8 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Add a New Review</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Rating:</label>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <FontAwesomeIcon
                                    key={value}
                                    icon={faStar}
                                    className={`cursor-pointer text-yellow-500 text-2xl ${value <= rating ? "opacity-100" : "opacity-50"}`}
                                    onClick={() => handleStarClick(value)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="comment">Comment:</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border rounded p-2 w-full"
                            rows="4"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-yellow-300 text-white rounded py-2 px-4">
                        Submit
                    </button>
                    <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

// Main review component that fetches reviews
const ReviewComponent = ({ turfId }) => {
    const [reviews, setReviews] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await fetch(`/api/review?turfId=${turfId}`);
                const data = await response.json();
                console.log(data, 'aaaaaaaaaaaa');

                // Fetch user details for each review (only if user exists)
                const userPromises = data
                    .filter(review => review.user && review.user._id)
                    .map(review =>
                        fetch(`/api/users/${review.user._id}`).then(res => res.json())
                    );

                const users = await Promise.all(userPromises);

                // Combine reviews with user details
                const reviewsWithUsers = data.map((review, index) => {
                    if (review.user && review.user._id) {
                        const userIndex = data.filter(r => r.user && r.user._id).findIndex(r => r.user._id === review.user._id);
                        return {
                            ...review,
                            user: users[userIndex]?.data || review.user,
                        };
                    }
                    // If no user data, provide default user object
                    return {
                        ...review,
                        user: review.user || {
                            _id: 'anonymous',
                            username: 'Anonymous User',
                            name: 'Anonymous',
                            email: 'anonymous@example.com'
                        }
                    };
                });

                setReviews(reviewsWithUsers);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        }

        if (turfId) {
            fetchReviews();
        }
    }, [turfId]);

    const [data, setdata] = useState(null)

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/getuser')
            setdata(res.data.data)
        } catch (error) {

        }

    }
    useEffect(() => {
        getUserDetails();
    }, [])
    const handleNewReviewSubmit = async (review) => {

        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: data._id, // Change to actual user ID
                    turf: turfId,
                    rating: review.rating,
                    comment: review.comment,
                }),
            });

            if (response.ok) {
                const newReview = await response.json();
                const userResponse = await fetch(`/api/users/${newReview.user}`);
                const user = await userResponse.json();
                const newReviewWithUser = { ...newReview, user: user.data };

                setReviews((prev) => [newReviewWithUser, ...prev]);
            } else {
                const errorData = await response.json();
                console.error('Failed to submit the review:', errorData.message);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <section className="py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative overflow-hidden z-10">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row justify-between">
                    <h2 className="text-2xl font-medium mb-6">Customer Reviews</h2>
                    <div>
                        <button
                            className="text-yellow-300 border border-yellow-300 hover:text-white hover:bg-yellow-300 rounded py-2 px-5 md:px-6"
                            onClick={() => setIsFormOpen(true)}
                        >
                            New Comment
                        </button>
                    </div>
                </div>
                <div className="reviews-section">
                    {reviews.map((review, i) => (
                        < ReviewItem item={review} key={i} />
                    ))}
                </div>
                <div className="py-6 text-center">
                    <button className="bg-yellow-300 text-white text-sm hover:bg-opacity-90 rounded py-2.5 px-6 md:px-10">
                        Load More
                    </button>
                </div>
            </div>
            {isFormOpen && (
                <ReviewForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleNewReviewSubmit}
                />
            )}
        </section>
    );
};

export default ReviewComponent;
