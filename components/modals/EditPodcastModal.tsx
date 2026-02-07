"use client";

import { FieldValues, set, SubmitHandler, useForm } from "react-hook-form";
import uniqid from "uniqid";

import Modal from "../Modal";
import { useEffect, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEditPodcastModal } from "@/hooks/useEditPodcastModal";
import { PodcastTag } from "@/types";
import { twMerge } from "tailwind-merge";
import SearchSelect from "../SearchSelect";

const PodcastEditModal = () => {
    const router = useRouter();
    const editPodcastModal = useEditPodcastModal();

    const [isLoading, setIsLoading] = useState(false);

    const { user } = useUser();

    const supabaseClient = useSupabaseClient();

    const podcastId = editPodcastModal.podcastId;

    interface Podcast {
        name: string;
        subtitle: string;
        description: string;
        author: string;
    }

    const [podcast, setPodcast] = useState<Podcast | null>(null);

    const [tags, setTags] = useState<PodcastTag[]>([]);

    const [selectOpen, setSelectOpen] = useState(false);

    const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

    const [selectedtagList, setSelectedTagList] = useState<{ id: string, listId: string }[]>([]);

    const [dbTags, setDbTags] = useState<{ id: string, listId: string }[]>([]);

    const fetchPodcast = async () => {
        try {
            const { data: podcast, error } = await supabaseClient
                .from('podcasts')
                .select('*')
                .eq('id', podcastId)
                .eq('user_id', user?.id)
                .single();

            if (error) {
                console.error("Error fetching podcast: ", error);
                toast.error("Failed to fetch podcast");
                return;
            }

            setPodcast(podcast);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    const fetchTags = async () => {
        const { data: tagsData, error } = await supabaseClient
            .from('podcast_tags')
            .select('*');

        if (error) {
            return toast.error(error.message);
        }

        console.log(tagsData);

        setTags(tagsData);
    }

    const fetchPodcastTags = async () => {
        const { data: podcastTagsData, error } = await supabaseClient
            .from('podcast_has_tags')
            .select('*')
            .eq('podcast_id', podcastId);

        if (error) {
            return toast.error(error.message);
        }

        console.log(podcastTagsData);

        setSelectedTagList(podcastTagsData.map((tag) => ({
            id: tag.tag_id,
            listId: tag.list_id
        })));
        setDbTags(podcastTagsData.map((tag) => ({
            id: tag.tag_id,
            listId: tag.list_id
        })));
    }

    useEffect(() => {
        if (!podcastId) {
            return;
        }

        fetchPodcast();
        fetchTags();
        fetchPodcastTags();
    }, [podcastId]);

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            name: podcast?.name || '',
            subtitle: podcast?.subtitle || '',
            description: podcast?.description || '',
            author: podcast?.author || '',
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            editPodcastModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const {
                error: supabaseError
            } = await supabaseClient
                .from(`podcasts`)
                .update({
                    name: values.name,
                    subtitle: values.subtitle,
                    description: values.description,
                    author: values.author,
                })
                .eq('id', podcastId)

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            const tagsToDelete = dbTags.filter(dbTag => !selectedtagList.some(tag => tag.id === dbTag.id));

            for (const tag of tagsToDelete) {
                const { error: deleteError } = await supabaseClient
                    .from('podcast_has_tags')
                    .delete()
                    .eq('list_id', tag.listId);

                if (deleteError) {
                    setIsLoading(false);
                    return toast.error(deleteError.message);
                }
            }

            const tagsToAdd = selectedtagList.filter(tag => !dbTags.some(dbTag => dbTag.id === tag.id));

            for (const tag of tagsToAdd) {
                const { error: addError } = await supabaseClient
                    .from('podcast_has_tags')
                    .insert({
                        podcast_id: podcastId,
                        tag_id: tag.id,
                        list_id: tag.listId,
                        user_id: user?.id
                    });

                if (addError) {
                    setIsLoading(false);
                    return toast.error(addError.message);
                }
            }

            router.refresh();
            setIsLoading(false);
            toast.success("Podcast uploaded successfully");
            reset();
            editPodcastModal.onClose();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        reset({
            name: podcast?.name || '',
            subtitle: podcast?.subtitle || '',
            description: podcast?.description || '',
            author: podcast?.author || '',
        });
    }, [podcast])

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
            title="Edit Podcast"
            description="Edit a podcast you uploaded to the platform"
            isOpen={editPodcastModal.isOpen}
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
                <Button disabled={isLoading} type="submit">
                    Edit Podcast
                </Button>
            </form>
        </Modal>
    );
}

export default PodcastEditModal;