"use client"
import React, { useEffect, useState } from 'react';
import NotionService from '@/services/notion-service';
import { FaHeart } from "react-icons/fa";

const notionService = new NotionService();

const Likes = ({ postId }) => {
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const likesCount = await notionService.getLikes(postId);
                setLikes(likesCount);
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchLikes();
    }, [postId]);

    return (
        <div className="flex items-center">
            <FaHeart className="text-red-400" />
            <span>{likes}</span>
        </div>
    );
};

export default Likes;
