import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "@/lib/api";
import { Play, Users, Video, ArrowLeft, Share2, MessageCircle, ThumbsUp, PenSquare } from "lucide-react";
import { cn, formatDateDDMMYYYY } from "@/lib/utils";
import { useAuthGuard } from "@/hooks/use-auth-guard.tsx";

interface ChannelProfile {
    _id: string;
    fullname: string;
    username: string;
    avatar: string;
    coverImage: string;
    email: string;
    subscribersCount: number;
    channelsSubscribedToCount: number;
    isSubscribed: boolean;
}

interface Video {
    _id: string;
    title: string;
    thumbnail: string;
    views: number;
    createdAt: string;
    duration: number;
}

interface TweetComment {
    _id: string;
    content: string;
    createdAt: string;
    likes: number;
    isLiked: boolean;
    owner: {
        fullname: string;
        username: string;
        avatar: string;
    };
}

interface Tweet {
    _id: string;
    content: string;
    createdAt: string;
    likes: number;
    isLiked: boolean;
    comments: TweetComment[];
}

const ChannelPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { ensureAuthenticated, AuthPromptDialog } = useAuthGuard();
    const [channel, setChannel] = useState<ChannelProfile | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [activeTab, setActiveTab] = useState<"videos" | "tweets">("videos");
    const [tweetInput, setTweetInput] = useState("");
    const [submittingTweet, setSubmittingTweet] = useState(false);
    const [tweetCommentInputs, setTweetCommentInputs] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchChannelData = async () => {
            if (!username) return;
            try {
                const channelRes = await api.get(`/users/c/${username}`);
                setChannel(channelRes.data.data);
                setIsSubscribed(channelRes.data.data.isSubscribed);

                // Fetch channel videos by filtering from all videos
                const videosRes = await api.get("/videos");
                const channelVideos = videosRes.data.data.filter(
                    (v: any) => v.owner._id === channelRes.data.data._id || v.owner[0]?._id === channelRes.data.data._id
                );
                setVideos(channelVideos);

                const tweetsRes = await api.get(`/tweets/user/${channelRes.data.data._id}`);
                setTweets(tweetsRes.data.data || []);
            } catch (error) {
                console.error("Error fetching channel data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChannelData();
    }, [username]);

    const handleSubscribe = async () => {
        if (!channel) return;
        if (!ensureAuthenticated("Subscribing to channels")) return;
        try {
            if (isSubscribed) {
                await api.delete(`/subscriptions/unsubscribe/${channel._id}`);
                setIsSubscribed(false);
                setChannel({
                    ...channel,
                    subscribersCount: channel.subscribersCount - 1,
                });
            } else {
                await api.post(`/subscriptions/subscribe/${channel._id}`);
                setIsSubscribed(true);
                setChannel({
                    ...channel,
                    subscribersCount: channel.subscribersCount + 1,
                });
            }
        } catch (error) {
            console.error("Error toggling subscription", error);
        }
    };

    const handleCreateTweet = async () => {
        if (!tweetInput.trim() || submittingTweet) return;
        if (!ensureAuthenticated("Posting tweets")) return;

        setSubmittingTweet(true);
        try {
            const response = await api.post("/tweets/create", { content: tweetInput.trim() });
            const newTweet = {
                ...response.data.data,
                likes: 0,
                isLiked: false,
                comments: [],
            };
            setTweets((prev) => [newTweet, ...prev]);
            setTweetInput("");
        } catch (error) {
            console.error("Error creating tweet", error);
        } finally {
            setSubmittingTweet(false);
        }
    };

    const handleTweetLike = async (tweetId: string, liked: boolean) => {
        if (!ensureAuthenticated("Liking tweets")) return;
        try {
            if (liked) {
                await api.delete(`/likes/tweet/unlike/${tweetId}`);
            } else {
                await api.put(`/likes/tweet/like/${tweetId}`);
            }

            setTweets((prev) => prev.map((tweet) =>
                tweet._id === tweetId
                    ? {
                        ...tweet,
                        isLiked: !liked,
                        likes: liked ? tweet.likes - 1 : tweet.likes + 1,
                    }
                    : tweet
            ));
        } catch (error) {
            console.error("Error toggling tweet like", error);
        }
    };

    const handleTweetComment = async (tweetId: string) => {
        const comment = tweetCommentInputs[tweetId]?.trim();
        if (!comment) return;
        if (!ensureAuthenticated("Commenting on tweets")) return;

        try {
            const response = await api.post(`/comments/tweet/add/${tweetId}`, { comment });
            const createdComment = response.data.data;

            setTweets((prev) => prev.map((tweet) =>
                tweet._id === tweetId
                    ? {
                        ...tweet,
                        comments: [
                            {
                                ...createdComment,
                                likes: 0,
                                isLiked: false,
                                owner: channel,
                            },
                            ...tweet.comments,
                        ],
                    }
                    : tweet
            ));

            setTweetCommentInputs((prev) => ({ ...prev, [tweetId]: "" }));
        } catch (error) {
            console.error("Error adding tweet comment", error);
        }
    };

    const handleTweetCommentLike = async (
        tweetId: string,
        commentId: string,
        liked: boolean
    ) => {
        if (!ensureAuthenticated("Liking tweet comments")) return;
        try {
            if (liked) {
                await api.delete(`/likes/comment/unlike/${commentId}`);
            } else {
                await api.put(`/likes/comment/like/${commentId}`);
            }

            setTweets((prev) => prev.map((tweet) =>
                tweet._id === tweetId
                    ? {
                        ...tweet,
                        comments: tweet.comments.map((comment) =>
                            comment._id === commentId
                                ? {
                                    ...comment,
                                    isLiked: !liked,
                                    likes: liked ? comment.likes - 1 : comment.likes + 1,
                                }
                                : comment
                        ),
                    }
                    : tweet
            ));
        } catch (error) {
            console.error("Error toggling tweet comment like", error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen animate-pulse">Loading channel...</div>;
    }

    if (!channel) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-black">Channel Not Found</h1>
                    <button
                        onClick={() => navigate("/")}
                        className="px-8 py-2 bg-primary text-white rounded-full font-black hover:scale-105 transition-transform"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <AuthPromptDialog />
            {/* Back Button */}
            {/* <div className="p-4 lg:p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-2xl transition-colors font-black uppercase text-xs tracking-widest text-muted-foreground hover:text-primary mb-4"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div> */}

            {/* Cover Image */}
            <div className="relative h-64 lg:h-80 overflow-hidden bg-gradient-to-r from-primary/20 to-primary/5">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-2xl transition-colors font-black uppercase text-xs tracking-widest text-muted-foreground hover:text-primary mb-4"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                {channel.coverImage ? (
                    <img
                        src={channel.coverImage}
                        alt="channel cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                )}
            </div>

            {/* Channel Info Section */}
            <div className="px-4 lg:px-8 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Channel Header */}
                    <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20 mb-12 relative z-10">
                        <img
                            src={channel.avatar}
                            alt={channel.fullname}
                            className="w-40 h-40 rounded-3xl border-4 border-background shadow-2xl object-cover"
                        />

                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">{channel.fullname}</h1>
                                <p className="text-muted-foreground font-bold text-sm pt-1">@{channel.username}</p>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm font-black uppercase tracking-widest text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-primary" />
                                    {channel.subscribersCount} Subscribers
                                </div>
                                <div className="flex items-center gap-2">
                                    <Video size={18} className="text-primary" />
                                    {videos.length} Videos
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4">
                                <button
                                    onClick={handleSubscribe}
                                    className={cn(
                                        "px-8 py-2.5 rounded-full font-black uppercase text-xs shadow-lg transition-all active:scale-95",
                                        isSubscribed
                                            ? "bg-muted text-muted-foreground border border-border hover:bg-red-500 hover:text-white hover:border-red-600"
                                            : "bg-primary text-white hover:scale-105"
                                    )}
                                >
                                    {isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>
                                <button className="p-2.5 hover:bg-muted rounded-full transition-colors">
                                    <Share2 size={20} className="text-muted-foreground hover:text-primary" />
                                </button>
                                <button className="p-2.5 hover:bg-muted rounded-full transition-colors">
                                    <MessageCircle size={20} className="text-muted-foreground hover:text-primary" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Videos Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                                {activeTab === "videos" ? (
                                    <>
                                        <Video size={28} className="text-primary" />
                                        Videos
                                    </>
                                ) : (
                                    <>
                                        <PenSquare size={28} className="text-primary" />
                                        Tweets
                                    </>
                                )}
                            </h2>

                            <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/20 p-1">
                                <button
                                    onClick={() => setActiveTab("videos")}
                                    className={cn(
                                        "px-4 py-2 text-xs font-black uppercase rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:focus-visible:text-black",
                                        activeTab === "videos" ? "bg-primary text-black" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    Videos
                                </button>
                                <button
                                    onClick={() => setActiveTab("tweets")}
                                    className={cn(
                                        "px-4 py-2 text-xs font-black uppercase rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:focus-visible:text-black",
                                        activeTab === "tweets" ? "bg-primary text-black" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    Tweets
                                </button>
                            </div>
                        </div>

                        {activeTab === "videos" && (videos.length === 0 ? (
                            <div className="py-20 text-center space-y-4 bg-muted/10 rounded-3xl border border-dashed border-border">
                                <Video size={48} className="mx-auto text-muted-foreground/30" />
                                <p className="text-muted-foreground font-medium">No videos uploaded yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {videos.map((video) => (
                                    <div
                                        key={video._id}
                                        onClick={() => navigate(`/watch/${video._id}`)}
                                        className="group cursor-pointer space-y-3"
                                    >
                                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/5 bg-black">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center">
                                                    <Play size={24} fill="currentColor" />
                                                </div>
                                            </div>
                                            {video.duration && (
                                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white">
                                                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, "0")}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-black text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                {video.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                                                <span>{video.views} views</span>
                                                <span>•</span>
                                                <span>{formatDateDDMMYYYY(video.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {activeTab === "tweets" && (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3">
                                    <textarea
                                        className="w-full bg-transparent border border-border rounded-xl p-3 text-sm font-medium outline-none focus:border-primary resize-none min-h-[90px]"
                                        placeholder="Share something with your audience..."
                                        value={tweetInput}
                                        onChange={(e) => setTweetInput(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleCreateTweet}
                                            disabled={!tweetInput.trim() || submittingTweet}
                                            className="px-5 py-2 rounded-xl bg-primary text-black    text-xs font-black uppercase tracking-widest disabled:opacity-60"
                                        >
                                            Post Tweet
                                        </button>
                                    </div>
                                </div>

                                {tweets.length === 0 ? (
                                    <div className="py-20 text-center space-y-4 bg-muted/10 rounded-3xl border border-dashed border-border">
                                        <PenSquare size={48} className="mx-auto text-muted-foreground/30" />
                                        <p className="text-muted-foreground font-medium">No tweets posted yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {tweets.map((tweet) => (
                                            <div key={tweet._id} className="rounded-2xl border border-border bg-muted/10 p-4 space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <img src={channel.avatar} alt={channel.fullname} className="w-10 h-10 rounded-xl object-cover" />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                                                            <span>{channel.fullname}</span>
                                                            <span>•</span>
                                                            <span>{formatDateDDMMYYYY(tweet.createdAt)}</span>
                                                        </div>
                                                        <p className="mt-1 text-sm font-semibold leading-relaxed whitespace-pre-wrap">{tweet.content}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs font-black uppercase">
                                                    <button
                                                        onClick={() => handleTweetLike(tweet._id, tweet.isLiked)}
                                                        className={cn(
                                                            "flex items-center gap-1 px-2 py-1 rounded-lg transition-colors",
                                                            tweet.isLiked ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                                                        )}
                                                    >
                                                        <ThumbsUp size={14} fill={tweet.isLiked ? "currentColor" : "none"} />
                                                        {tweet.likes}
                                                    </button>
                                                    <span className="text-muted-foreground">{tweet.comments.length} comments</span>
                                                </div>

                                                <div className="space-y-3 pt-2 border-t border-border/60">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={tweetCommentInputs[tweet._id] || ""}
                                                            onChange={(e) => setTweetCommentInputs((prev) => ({ ...prev, [tweet._id]: e.target.value }))}
                                                            placeholder="Write a comment..."
                                                            className="flex-1 bg-transparent border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                                                        />
                                                        <button
                                                            onClick={() => handleTweetComment(tweet._id)}
                                                            className="px-4 py-2 rounded-xl bg-primary text-black text-[11px] font-black uppercase tracking-widest"
                                                        >
                                                            Comment
                                                        </button>
                                                    </div>

                                                    {tweet.comments.length > 0 && (
                                                        <div className="space-y-3">
                                                            {tweet.comments.map((comment) => (
                                                                <div key={comment._id} className="rounded-xl bg-muted/40 border border-border p-3">
                                                                    <div className="flex items-start gap-3">
                                                                        <img src={comment.owner?.avatar} alt={comment.owner?.fullname} className="w-8 h-8 rounded-lg object-cover" />
                                                                        <div className="min-w-0 flex-1">
                                                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
                                                                                <span>{comment.owner?.fullname}</span>
                                                                                <span>•</span>
                                                                                <span>{formatDateDDMMYYYY(comment.createdAt)}</span>
                                                                            </div>
                                                                            <p className="text-sm font-medium mt-1">{comment.content}</p>
                                                                            <button
                                                                                onClick={() => handleTweetCommentLike(tweet._id, comment._id, comment.isLiked)}
                                                                                className={cn(
                                                                                    "mt-2 flex items-center gap-1 text-[10px] font-black uppercase",
                                                                                    comment.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
                                                                                )}
                                                                            >
                                                                                <ThumbsUp size={12} fill={comment.isLiked ? "currentColor" : "none"} />
                                                                                {comment.likes}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelPage;
