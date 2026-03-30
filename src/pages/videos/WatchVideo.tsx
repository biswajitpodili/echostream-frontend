import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ThumbsUp, ThumbsDown, Share2, MoreVertical, Eye, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import VideoPlayer from "@/components/video/VideoPlayer";
import api from "@/lib/api";
import { useAuth } from "@/context/useAuth";
import { cn, formatDateDDMMYYYY } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useAuthGuard } from "@/hooks/use-auth-guard.tsx";

interface Video {
    _id: string;
    videoFile: string;
    title: string;
    description: string;
    views: number;
    likes: number;
    isLiked: boolean;
    createdAt: string;
    owner: {
        _id: string;
        fullname: string;
        avatar: string;
        totalSubscribers: number;
        isSubscribedtoThisChannel: boolean;
    };
    comments: any[];
}

const WatchVideo = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { ensureAuthenticated, AuthPromptDialog } = useAuthGuard();
    const [video, setVideo] = useState<Video | null>(null);
    const [upNext, setUpNext] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/videos/watch/${videoId}`);
                setVideo(response.data.data);

                // Initialize comment liked-state from the video response itself.
                const likedCommentIds = new Set<string>(
                    (response.data.data.comments || [])
                        .filter((comment: any) => comment.isLiked)
                        .map((comment: any) => comment._id)
                );
                setLikedComments(likedCommentIds);
                
                // Fetch other videos for "Up Next"
                const allVideos = await api.get("/videos");
                const otherVideos = allVideos.data.data.filter((v: any) => v._id !== videoId);
                setUpNext(otherVideos);
            } catch (error) {
                console.error("Error fetching video", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [videoId]);

    const handleLike = async () => {
        if (!video) return;
        if (!ensureAuthenticated("Liking videos")) return;
        try {
            if (video.isLiked) {
                await api.delete(`/likes/video/unlike/${videoId}`);
                setVideo({
                    ...video,
                    isLiked: false,
                    likes: video.likes - 1
                });
            } else {
                await api.put(`/likes/video/like/${videoId}`);
                setVideo({
                    ...video,
                    isLiked: true,
                    likes: video.likes + 1
                });
            }
        } catch (error) {
            console.error("Error toggling like", error);
        }
    };

    const handleSubscribe = async () => {
        if (!video) return;
        if (!ensureAuthenticated("Subscribing to channels")) return;
        try {
            if (video.owner.isSubscribedtoThisChannel) {
                await api.delete(`/subscriptions/unsubscribe/${video.owner._id}`);
                setVideo({
                    ...video,
                    owner: {
                        ...video.owner,
                        isSubscribedtoThisChannel: false,
                        totalSubscribers: video.owner.totalSubscribers - 1
                    }
                });
            } else {
                await api.post(`/subscriptions/subscribe/${video.owner._id}`);
                setVideo({
                    ...video,
                    owner: {
                        ...video.owner,
                        isSubscribedtoThisChannel: true,
                        totalSubscribers: video.owner.totalSubscribers + 1
                    }
                });
            }
        } catch (error) {
            console.error("Error toggling subscription", error);
        }
    };

    const handleCommentLike = async (commentId: string) => {
        if (!ensureAuthenticated("Liking comments")) return;
        try {
            const isLiked = likedComments.has(commentId);
            if (isLiked) {
                await api.delete(`/likes/comment/unlike/${commentId}`);
            } else {
                await api.put(`/likes/comment/like/${commentId}`);
            }
            
            // Update liked comments state
            const newLikedComments = new Set(likedComments);
            if (isLiked) {
                newLikedComments.delete(commentId);
            } else {
                newLikedComments.add(commentId);
            }
            setLikedComments(newLikedComments);

            // Update video comments state to reflect the like change
            if (video) {
                setVideo({
                    ...video,
                    comments: video.comments.map(comment => 
                        comment._id === commentId 
                            ? { ...comment, likes: isLiked ? comment.likes - 1 : comment.likes + 1 }
                            : comment
                    )
                });
            }
        } catch (error) {
            console.error("Error toggling comment like", error);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || submittingComment) return;
        if (!ensureAuthenticated("Commenting on videos")) return;
        
        setSubmittingComment(true);
        try {
            const response = await api.post(`/comments/add/${videoId}`, { comment: commentText });
            const newComment = {
                ...response.data.data,
                owner: user,
                likes: 0,
                isLiked: false,
                createdAt: new Date().toISOString()
            };
            setVideo({
                ...video!,
                comments: [newComment, ...video!.comments]
            });
            setCommentText("");
        } catch (error) {
            console.error("Error adding comment", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen animate-pulse">Loading experience...</div>;
    if (!video) return <div className="flex items-center justify-center min-h-screen font-black uppercase tracking-tighter">Video vanished into the void.</div>;

    return (
        <div className="p-4 lg:p-4 py-0 space-y-6">
            <AuthPromptDialog />
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-2xl transition-colors font-black uppercase text-xs tracking-widest text-muted-foreground hover:text-primary mb-2"
            >
                <ArrowLeft size={16} /> Back to Discovery
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] bg-black aspect-video border border-white/5">
                        <VideoPlayer src={video.videoFile} />
                    </div>

                    <div className="space-y-4 px-2">
                        <div className="flex justify-between items-start gap-4">
                            <h1 className="text-2xl lg:text-3xl font-black tracking-tighter leading-none">{video.title}</h1>
                            {video.isLiked && (
                                <div className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-[9px] font-black uppercase tracking-widest animate-in zoom-in slide-in-from-right duration-500 flex items-center gap-1.5 shrink-0">
                                    <CheckCircle2 size={12} /> Liked by you
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center gap-6 py-4 border-b border-border">
                            <div className="flex items-center gap-4">
                                <img src={video.owner.avatar} className="w-14 h-14 rounded-[1.25rem] border-2 border-primary/20 shadow-md object-cover" alt="" />
                                <div>
                                    <h3 className="font-black text-lg leading-none flex items-center gap-2">
                                        {video.owner.fullname}
                                        {video.owner.isSubscribedtoThisChannel && <CheckCircle2 size={14} className="text-primary" />}
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground pt-1">{video.owner.totalSubscribers} Subscribers</p>
                                </div>
                                <button 
                                    onClick={handleSubscribe}
                                    className={cn(
                                        "ml-4 px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-xl transition-all active:scale-95",
                                        video.owner.isSubscribedtoThisChannel 
                                            ? "bg-muted text-muted-foreground border border-border" 
                                            : "bg-transparent border border-white/30 text-white hover:scale-105"
                                    )}
                                >
                                    {video.owner.isSubscribedtoThisChannel ? 'Subscribed' : 'Subscribe'}
                                </button>
                            </div>

                            <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-[1.5rem] border border-border/50">
                                <button 
                                    onClick={handleLike}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all",
                                        video.isLiked 
                                            ? "bg-primary text-black shadow-lg" 
                                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                                    )}
                                    title={video.isLiked ? "Unlike this video" : "Like this video"}
                                >
                                    <ThumbsUp 
                                        size={18} 
                                        fill={video.isLiked ? "black" : "none"} 
                                        strokeWidth={video.isLiked ? 0 : 2}
                                    /> 
                                    {video.likes}
                                </button>
                                <Separator orientation="vertical" className="h-8" />
                                <button className="p-3 hover:bg-muted  rounded-xl transition-colors">
                                    <ThumbsDown size={18} />
                                </button>
                                <Separator orientation="vertical" className="h-8" />
                                <div className="flex items-center gap-2 px-4 cursor-pointer group/share">
                                    <Share2 size={18} className="text-muted-foreground group-hover/share:text-primary transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover/share:text-white transition-colors">Share</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/30 rounded-[2rem] p-8 space-y-4 border border-border/50 shadow-inner">
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                <span className="flex items-center gap-1.5 text-primary"><Eye size={14}/> {video.views} Views</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDateDDMMYYYY(video.createdAt)}</span>
                            </div>
                            <p className="text-muted-foreground/90 leading-relaxed font-semibold italic text-sm border-l-2 border-primary/20 pl-4">
                                {video.description}
                            </p>
                        </div>

                        <div className="pt-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black tracking-tighter">Community <span className="text-primary">Voice</span> ({video.comments.length})</h2>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest border border-border px-3 py-1.5 rounded-full cursor-pointer hover:bg-muted">
                                    <span>Sort By</span>
                                    <MoreVertical size={14} />
                                </div>
                            </div>

                            <form onSubmit={handleComment} className="flex gap-4 items-start bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 group focus-within:border-primary/30 transition-all">
                                <img src={user?.avatar} className="w-12 h-12 rounded-2xl shadow-xl border-2 border-primary/20 shrink-0" alt="" />
                                <div className="flex-1 space-y-4">
                                    <textarea 
                                        className="w-full bg-transparent border-b border-border/50 focus:border-primary outline-none transition-colors p-2 text-sm font-semibold tracking-tight placeholder:text-muted-foreground/50 resize-none min-h-[60px]" 
                                        placeholder="Add a comment on echoStream..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end gap-3">
                                        {commentText && (
                                            <button 
                                                type="button" 
                                                onClick={() => setCommentText("")}
                                                className="px-6 py-2 text-[10px] font-black uppercase bg-muted/50 hover:bg-muted rounded-full transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button 
                                            disabled={!commentText.trim() || submittingComment}
                                            className="bg-primary text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase shadow-xl shadow-primary/30 disabled:opacity-50 disabled:scale-100 hover:scale-105 transition-transform"
                                        >
                                            Publish Comment
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="space-y-10">
                                {video.comments.map((comment: any) => (
                                    <div key={comment._id} className="flex gap-5 group/comment">
                                        <img src={comment.owner.avatar} className="w-12 h-12 rounded-[1.25rem] shadow-md border border-border/50 shrink-0 object-cover" alt="" />
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-black tracking-tight">{comment.owner.fullname}</span>
                                                <span className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-tighter italic">{formatDateDDMMYYYY(comment.createdAt)}</span>
                                            </div>
                                            <p className="text-sm font-semibold leading-relaxed text-muted-foreground group-hover/comment:text-foreground transition-colors">{comment.content}</p>
                                            <div className="flex items-center gap-6 pt-1">
                                                <button 
                                                    onClick={() => handleCommentLike(comment._id)}
                                                    className={cn(
                                                        "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all px-2 py-1 rounded",
                                                        likedComments.has(comment._id) 
                                                            ? "text-primary bg-primary/10" 
                                                            : "text-muted-foreground hover:text-primary hover:bg-muted/20"
                                                    )}
                                                    title={likedComments.has(comment._id) ? "Unlike this comment" : "Like this comment"}
                                                >
                                                    <ThumbsUp 
                                                        size={14} 
                                                        fill={likedComments.has(comment._id) ? "currentColor" : "none"}
                                                        strokeWidth={likedComments.has(comment._id) ? 0 : 2}
                                                    /> 
                                                    {comment.likes}
                                                </button>
                                                <button className="text-[10px] font-black text-muted-foreground hover:text-red-500 transition-colors uppercase tracking-[0.2em]">Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black uppercase tracking-tighter">Echo <span className="text-primary">Next</span></h2>
                        <span className="text-[10px] font-black px-2 py-1 bg-primary text-white rounded-lg animate-pulse tracking-widest">LIVE</span>
                    </div>
                    <div className="space-y-4">
                        {upNext.length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-border rounded-[2rem] text-center space-y-2 grayscale group hover:grayscale-0 transition-all">
                                <h4 className="text-xs font-black uppercase tracking-tighter text-muted-foreground italic">Videos not available</h4>
                                <p className="text-[10px] font-bold text-muted-foreground/40">You've reached the end of the void.</p>
                            </div>
                        ) : (
                            upNext.map((v) => (
                                <div 
                                    key={v._id} 
                                    onClick={() => navigate(`/watch/${v._id}`)}
                                    className="flex gap-4 group cursor-pointer p-3 rounded-[1.5rem] hover:bg-muted/40 transition-all border border-transparent hover:border-border/50"
                                >
                                    <div className="w-40 md:w-48 aspect-video rounded-xl overflow-hidden shadow-lg border border-white/5 shrink-0">
                                        <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-in-out" alt="" />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h4 className="text-xs lg:text-sm font-black line-clamp-2 leading-tight group-hover:text-primary transition-colors tracking-tight italic">
                                            {v.title}
                                        </h4>
                                        <p className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-widest">{v.owner?.fullname || v.owner?.[0]?.fullname}</p>
                                        <div className="flex items-center gap-3 text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter">
                                            <span>{v.views} Views</span>
                                            <span className="w-1 h-1 bg-muted-foreground/20 rounded-full" />
                                            <span>{formatDateDDMMYYYY(v.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchVideo;
