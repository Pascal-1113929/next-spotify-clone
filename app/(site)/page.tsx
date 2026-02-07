import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "./components/PageContent";
import Link from "next/link";
import PlaylistContent from "./components/PlaylistContent";
import getPlaylists from "@/actions/getPlaylists";
import getPublicPlaylists from "@/actions/getPublicPlaylists";
import getUser from "@/actions/getUser";
import AlbumContent from "./components/AlbumContent";
import getAlbums from "@/actions/getAlbums";
import PodcastContent from "./components/PodcastContent";
import getPodcasts from "@/actions/getPodcasts";
import getFollowingPlaylists from "@/actions/getFollowingPodcasts";
import getMyPodcasts from "@/actions/getMyPodcasts";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const playlists = await getPlaylists();
  const publicPlaylists = await getPublicPlaylists();
  const user = await getUser();
  const albums = await getAlbums();
  const MyPodcasts = await getMyPodcasts();
  const FollowPodcasts = await getFollowingPlaylists();
  const Podcasts = await getPodcasts();

  const userId = user?.id;

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="
          text-white
          text-3xl
          font-semibold
          ">
            Welcome back
          </h1>
          <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-4
          gap-3
          mt-4
          ">
            <ListItem
              image="/images/liked.png"
              name="Liked Songs"
              href="/liked"
            />
          </div>
        </div>
      </Header>
      {/* <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Newest Songs
          </h1>
        </div>
        <div>
          <PageContent songs={songs} />
        </div>
      </div> */}
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold mb-2">
            Newest Songs
          </h1>
          <Link href="/songs">
            <p className="text-white text-sm font-semibold mr-3 hover:underline">
              View All
            </p>
          </Link>
        </div>
        <div>
          <PageContent songs={songs} userId={userId} />
        </div>
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold mb-2">
            My Playlists
          </h1>
          <Link href="/playlist/list/all">
            <p className="text-white text-sm font-semibold mr-3 hover:underline">
              View All
            </p>
          </Link>
        </div>
        <div>
          {/* <PageContent songs={songs} /> */}
          <PlaylistContent playlists={playlists} userId={userId} />
          {/* <p className="text-red-500">This is in development</p> */}
        </div>
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold mb-2">
            Public Playlists
          </h1>
          <Link href="/playlist/list/all">
            <p className="text-white text-sm font-semibold mr-3 hover:underline">
              View All
            </p>
          </Link>
        </div>
        <div>
          {/* <PageContent songs={songs} /> */}
          {/* <p className="text-red-500">This is in development</p> */}
          <PlaylistContent playlists={publicPlaylists} userId={userId} />
        </div>
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold mb-2">
            Newest Albums
          </h1>
          <Link href="/album/list">
            <p className="text-white text-sm font-semibold mr-3 hover:underline">
              View All
            </p>
          </Link>
        </div>
        <div>
          <AlbumContent albums={albums} userId={userId} />
        </div>
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold mb-2">
            My Podcasts
          </h1>
          <Link href="/podcasts/list/all">
            <p className="text-white text-sm font-semibold mr-3 hover:underline">
              View All
            </p>
          </Link>
        </div>
        <div>
          {/* <PageContent songs={songs} /> */}
          <PodcastContent podcasts={MyPodcasts} userId={userId} />
          {/* <p className="text-red-500">This is in development</p> */}
        </div>
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold mb-2">
            Following Podcasts
          </h1>
          <Link href="/podcasts/list/following">
            <p className="text-white text-sm font-semibold mr-3 hover:underline">
              View All
            </p>
          </Link>
        </div>
        <div>
          {/* <PageContent songs={songs} /> */}
          <PodcastContent podcasts={FollowPodcasts} userId={userId} />
          {/* <p className="text-red-500">This is in development</p> */}
        </div>
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold mb-2">
            Podcasts
          </h1>
          <Link href="/podcasts/list/all">
            <p className="text-white text-sm font-semibold mr-3 hover:underline">
              View All
            </p>
          </Link>
        </div>
        <div>
          {/* <PageContent songs={songs} /> */}
          <PodcastContent podcasts={Podcasts} userId={userId} />
          {/* <p className="text-red-500">This is in development</p> */}
        </div>
      </div>
    </div>
  )
}