// import getAlbumSongs from "@/actions/getAlbumSongs";
import getData from "@/actions/getData";
// import Clientpage from "./cp";


const DebugPage = async () => {
    console.log("DebugPage component is rendering");
    const data = await getData('podcast_tags');
    // const data = await getAlbumSongs('1');
    // console.log("Fetched data:", data);


    return (
        <div>
            <h1>Debug Page</h1>
            {JSON.stringify(data)}
            {/* <Clientpage /> */}
        </div>
    );
}

export default DebugPage;