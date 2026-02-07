"use client"

import { useCreatePodcastTagModal } from "@/hooks/useCreatePodcastTagModal";
import uniqid from "uniqid";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
const CreatePodcastTagModal = () => {
    const router = useRouter();
    const createPodcastTagModal = useCreatePodcastTagModal();

    const [isLoading, setIsLoading] = useState(false);

    const { user } = useUser();

    const supabaseClient = useSupabaseClient();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            createPodcastTagModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            if (!user) {
                toast.error("Missing fields");
                return;
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from(`podcast_tags`)
                .insert({
                    user_id: user.id,
                    name: values.name,
                });

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success("PodcastTag Created successfully");
            reset();
            createPodcastTagModal.onClose();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title="Create PodcastTag"
            description="Create a new podcast tag"
            isOpen={createPodcastTagModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input
                    id="name"
                    disabled={isLoading}
                    {...register('name', { required: true })}
                    placeholder="PodcastTag Name"
                />
                <Button disabled={isLoading} type="submit">
                    Create Podcast Tag
                </Button>
            </form>
        </Modal>
    );
}

export default CreatePodcastTagModal;