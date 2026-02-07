"use client"

import Button from "@/components/Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

interface TagButtonProps {
    tag: { name: string, id: string };
}

const TagButton = ({ tag }: TagButtonProps) => {
    const supabaseClient = useSupabaseClient();

    return (
        <Link href={`/tag/${tag.id}`}>
            <Button className="bg-neutral-400/40 text-white text-sm font-normal h-[15px] w-[100px] flex items-center justify-center">
                {tag.name}
            </Button>
        </Link>
    );
}

export default TagButton;