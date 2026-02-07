"use client"

import { useCreatePodcastModal } from "@/hooks/useCreatePodcastModal";
import uniqid from "uniqid";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { useForm, FieldValues, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { PodcastTag } from "@/types";
import SearchSelect from "../SearchSelect";
import { twMerge } from "tailwind-merge";
const CreatePodcastModal = () => {
    const router = useRouter();
    const createPodcastModal = useCreatePodcastModal();

    const [isLoading, setIsLoading] = useState(false);

    const { user } = useUser();

    const supabaseClient = useSupabaseClient();

    const [tags, setTags] = useState<PodcastTag[]>([]);

    const [selectOpen, setSelectOpen] = useState(false);

    const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

    const [selectedtagList, setSelectedTagList] = useState<{ id: string, listId: string}[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            const { data: tagsData, error } = await supabaseClient
                .from('podcast_tags')
                .select('*');

            if (error) {
                return toast.error(error.message);
            }

            // console.log(tagsData);

            setTags(tagsData);
        }

        fetchTags();
    }, [])

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            subtitle: '',
            description: '',
            author: '',
            tag_id: '',
            image: null,
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            setSelectOpen(false);
            setSelectedTagList([]);
            setSelectedTag(undefined);
            createPodcastModal.onClose();
        }
    }

    const sanitizeFileName = (name: string) => {
        return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];

            if (!imageFile || !user) {
                toast.error("Missing fields");
                return;
            }

            const uniqueID = uniqid();
            const sanitizedFileName = sanitizeFileName(values.name);

            // upload image
            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${sanitizedFileName}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (imageError) {
                setIsLoading(false);
                return toast.error("Failed to upload image");
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from(`podcasts`)
                .insert({
                    user_id: user.id,
                    name: values.name,
                    subtitle: values.subtitle,
                    description: values.description,
                    author: values.author,
                    image_path: imageData.path,
                });

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            const { data: podcastData, error: podcastError } = await supabaseClient
                .from('podcasts')
                .select('*')
                .eq('image_path', imageData.path)
                .single();

            if (podcastError) {
                setIsLoading(false);
                return toast.error(podcastError.message);
            }

            for (const tag of selectedtagList) {
                const { error: tagError } = await supabaseClient
                    .from('podcast_has_tags')
                    .insert({
                        podcast_id: podcastData.id,
                        tag_id: tag.id,
                        user_id: user.id,
                        list_id: tag.listId,
                    });

                if (tagError) {
                    setIsLoading(false);
                    console.error(tagError);
                    return toast.error(tagError.message);
                }
            }

            router.refresh();
            setIsLoading(false);
            toast.success("Podcast Created successfully");
            reset();
            setSelectOpen(false);
            setSelectedTagList([]);
            setSelectedTag(undefined);
            createPodcastModal.onClose();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const AddTag = () => {
        if (selectedTag) {
            setSelectedTagList([...selectedtagList, { id: selectedTag, listId: uniqid() }]);
        }
    }

    const RemoveTag = (tag: { id: string, listId: string }) => {
        setSelectedTagList(selectedtagList.filter(t => t.listId !== tag.listId));
    }

    return (
        <Modal
            title="Create Podcast"
            description="Create a new podcast"
            isOpen={createPodcastModal.isOpen}
            onChange={onChange}
        >
            <div className="mb-4">
                <SearchSelect
                    disabled={isLoading}
                    data={tags.map(tag => ({ id: tag.id, name: tag.name }))}
                    isOpen={selectOpen}
                    onOpenChange={() => setSelectOpen(!selectOpen)}
                    placeholder="Select a Tag"
                    className="mb-4"
                    selected={selectedTag}
                    onSelect={(selectedTag) => setSelectedTag(selectedTag)}
                />
                <Button disabled={isLoading} onClick={AddTag}>
                    Add Tag To Podcast
                </Button>
            </div>
            <div className={twMerge(
                "flex flex-wrap gap-2",
                selectedtagList.length !== 0 && "mb-4"
                )}>
                {selectedtagList.map((tag) => {
                    const tagData = tags.find(t => t.id === tag.id);
                    return (
                        <div key={tag.id} className="bg-neutral-700 rounded-full px-4 py-2 flex flex-row items-center gap-x-2">
                            {tagData?.name}
                            <button onClick={() => RemoveTag(tag)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input
                    id="name"
                    disabled={isLoading}
                    {...register('name', { required: true })}
                    placeholder="Podcast Name"
                />
                <Input
                    id="subtitle"
                    disabled={isLoading}
                    {...register('subtitle', { required: true })}
                    placeholder="Podcast Subtitle"
                />
                <Input
                    id="description"
                    disabled={isLoading}
                    {...register('description', { required: true })}
                    placeholder="Podcast Description"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Podcast Author"
                />
                <div>
                    <div className="pb-1">
                        Select an image
                    </div>
                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register('image', { required: true })}
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Create Podcast
                </Button>
            </form>
        </Modal>
    );
}

export default CreatePodcastModal;