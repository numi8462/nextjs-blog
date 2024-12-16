"use client"
import { useState, useEffect } from 'react';
import NotionService from '@/services/notion-service';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

const notionService = new NotionService();

const LikeButton = ({ postId, initialLikes }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        setLiked(likedPosts.includes(postId));
    }, [postId]);

    const handleLike = async () => {
        try {
            const action = liked ? 'unlike' : 'like';
            const updatedLikes = await notionService.updateLikes(postId, action);
            setLikes(updatedLikes);

            const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
            if (action === 'like') {
                localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, postId]));
            } else {
                localStorage.setItem('likedPosts', JSON.stringify(likedPosts.filter(id => id !== postId)));
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error updating like status', error);
        }
    };

    return (
        <button onClick={handleLike} className="flex items-center gap-1">
            {liked ? <FaHeart className="text-red-400 text-xl" /> : <FaRegHeart className='text-red-400 text-xl'/>} {likes}
        </button>
    );
};

export default LikeButton;

