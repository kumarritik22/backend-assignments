import Post from "../components/Post";
import "../style/feed.scss";
import { usePost } from "../hook/usePost";
import { useEffect, useEffectEvent, useLayoutEffect } from "react";

const Feed = () => {

    const {loading, feed, handleGetFeed} = usePost()

    useEffect(() => {
        handleGetFeed()
    }, [])

    if (loading || !feed) {
        return (<main>
            <h1>Feed is loading...</h1>
        </main>)
    }

    console.log(feed);

  return (
    <main className="feed-page">
        <div className="feed">
            <div className="posts">
                {feed.map(post => {
                    return <Post user={post.user} post={post} />
                })}
            </div>
        </div>
    </main>
  )
}

export default Feed
