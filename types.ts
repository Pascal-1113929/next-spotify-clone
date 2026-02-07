import exp from "constants";
import Stripe from "stripe";

export interface UserDetails {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    avatar_url?: string;
    billing_address?: Stripe.Address;
    payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface Product {
    id: string;
    active?: boolean;
    name?: string;
    description?: string;
    image?: string;
    metadata?: Stripe.Metadata;
}

export interface Price {
    id: string;
    product_id?: string;
    active?: boolean;
    description?: string;
    unit_amount?: number;
    currency?: string;
    type: Stripe.Price.Type;
    interval?: Stripe.Price.Recurring.Interval;
    interval_count?: number;
    trial_period_days?: number | null;
    metadata?: Stripe.Metadata;
    product?: Product;
}

export interface Subscription {
    id: string;
    user_id: string;
    status?: Stripe.Subscription.Status;
    metadata?: Stripe.Metadata;
    price_id?: string;
    quantity?: number;
    cancel_at_period_end?: boolean;
    created: string;
    current_period_start: string;
    current_period_end: string;
    ended_at?: string;
    cancel_at?: string;
    canceled_at?: string;
    trial_start?: string;
    trial_end?: string;
    prices?: Price;
}

export interface Song {
    id: string;
    user_id: string;
    author: string;
    title: string;
    album_id: string;
    song_path: string;
    image_path: string;
};

export interface Playlist {
    id: string;
    user_id: string;
    name: string;
    description: string;
    image_path: string;
    is_public: boolean;
}

export interface Album {
    id: string;
    user_id: string;
    name: string;
    author: string;
    is_public: boolean;
    image_path: string;
}

export interface Podcast {
    id: string;
    user_id: string;
    name: string;
    subtitle: string;
    description: string;
    author: string;
    image_path: string;
    isFollowed: boolean;
}

export interface PodcastTag {
    id: string;
    name: string;
    listId: string;
}

export interface PodcastEpisode {
    id: string;
    user_id: string;
    episode_number: string;
    name: string;
    created_at: string;
    episode_description: string;
    episode_path: string;
    podcast_id: string;
    chunks: PodcastEpisodeChunk[];
}

export interface ProductWithPrice extends Product {
    prices?: Price[];
}

export interface PodcastEpisodeChunk {
    id: string;
    episode_id: string;
    chunk_path: string;
}

export interface PodcastEpisodeWithChunks extends PodcastEpisode {
    chunks: PodcastEpisodeChunk[];
}