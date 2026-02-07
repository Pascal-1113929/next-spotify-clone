"use client"

import { BounceLoader } from "react-spinners";

const Loading = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <BounceLoader color="#22c55e" />
        </div>
    );
} 

export default Loading;