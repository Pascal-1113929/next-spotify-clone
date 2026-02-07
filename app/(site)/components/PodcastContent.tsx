import PodcastItem from "@/components/PodcastItem";
import { Podcast } from "@/types";

interface PodcastContentProps {
    podcasts: Podcast[];
    userId: string | undefined;
}

const PodcastContent: React.FC<PodcastContentProps> = ({ podcasts, userId }) => {
    if (podcasts.length === 0) {
        return (
            <div className="mt-4 text-neutral-400">
                No Podcasts Available
            </div>
        )
    }
    return (
        <div className="grid grid-rows-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 lx:grid-cols-5 2xl:grid-cols-8 gap-4 ml-4">
            {podcasts.slice(0, 16).map((item) => (
                <PodcastItem
                    key={item.id}
                    data={item}
                    isOwner={item.user_id === userId}
                />
            ))}
        </div>
    );
}

export default PodcastContent;