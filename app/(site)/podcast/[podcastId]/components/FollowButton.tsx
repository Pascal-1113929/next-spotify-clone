"use client"

import Button from "@/components/Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";

interface FollowButtonProps {
    isFollowing: boolean;
    user_id: string | undefined;
    podcast_id: string;
}

const FollowButton = ({ isFollowing, user_id, podcast_id }: FollowButtonProps) => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const ChangeFollow = async () => {
        if (!user_id) {
            return;
        }

        if (isFollowing) {
            // Unfollow
            const { error: unfollowError } = await supabaseClient
                .from('podcast_follows')
                .delete()
                .eq('user_id', user_id)
                .eq('podcast_id', podcast_id);

            if (unfollowError) {
                console.error('Error unfollowing podcast:', unfollowError);
                toast.error('Error unfollowing podcast');
                return;
            }

            toast.success('Unfollowed Podcast');
        }
        else {
            // Follow
            const { error: followError } = await supabaseClient
                .from('podcast_follows')
                .insert({
                    podcast_id: podcast_id,
                    user_id: user_id
                });

            if (followError) {
                console.error('Error following podcast:', followError);
                toast.error('Error following podcast');
                return;
            }
            toast.success('Followed Podcast');

        }
        router.refresh();
    }

    return (
        <Button className="bg-transparent border border-primary-500 text-primary-500 lg:w-[5vw] lg:h-[3vh] text-md font-semibold flex items-center justify-center" onClick={ChangeFollow}>
            {isFollowing ? 'Following' : 'Follow'} {!isFollowing && (<AiOutlinePlus color="white" className="ml-2" />)}
        </Button>
    );
}

export default FollowButton;