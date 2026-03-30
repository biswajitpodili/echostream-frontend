import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { UserCheck, Search, Bell, Star, Play, Eye, Clock } from "lucide-react";
import { formatDateDDMMYYYY } from "@/lib/utils";

interface SubscriptionItem {
    _id: string;
    channel: {
        _id: string;
        fullname: string;
        username: string;
        avatar: string;
    };
}

interface SubscriptionVideo {
    _id: string;
    title: string;
    thumbnail: string;
    views: number;
    createdAt: string;
    owner: {
        _id?: string;
        fullname?: string;
        username?: string;
        avatar?: string;
    } | Array<{
        _id?: string;
        fullname?: string;
        username?: string;
        avatar?: string;
    }>;
}

const getVideoOwner = (owner: SubscriptionVideo["owner"]) =>
    Array.isArray(owner) ? owner[0] : owner;

const Subscriptions = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
    const [subscriptionVideos, setSubscriptionVideos] = useState<SubscriptionVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const [subscriptionsRes, videosRes] = await Promise.all([
                    api.get("/subscriptions/subscribed-to"),
                    api.get("/videos"),
                ]);

                const subscribedChannels: SubscriptionItem[] = subscriptionsRes.data.data || [];
                setSubscriptions(subscribedChannels);

                const subscribedChannelIds = new Set(
                    subscribedChannels.map((sub) => sub.channel?._id).filter(Boolean)
                );

                const subscribedOnlyVideos = (videosRes.data.data || []).filter((video: SubscriptionVideo) => {
                    const owner = getVideoOwner(video.owner);
                    return !!owner?._id && subscribedChannelIds.has(owner._id);
                });

                setSubscriptionVideos(subscribedOnlyVideos);
            } catch (error) {
                console.error("Error fetching subscriptions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    const handleUnsubscribe = async (id: string, channelId: string) => {
        if (!window.confirm("Are you sure you want to unsubscribe from this channel?")) return;
        try {
            await api.delete(`/subscriptions/unsubscribe/${channelId}`);
            setSubscriptions((prev) => prev.filter((s) => s._id !== id));
            setSubscriptionVideos((prev) =>
                prev.filter((video) => {
                    const owner = getVideoOwner(video.owner);
                    return owner?._id !== channelId;
                })
            );
        } catch (error) {
            console.error("Error unsubscribing", error);
            alert("Failed to unsubscribe");
        }
    };

    const filteredSubscriptions = subscriptions.filter(s => 
        s.channel.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.channel.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredChannelIds = new Set(filteredSubscriptions.map((sub) => sub.channel._id));
    const filteredVideos = subscriptionVideos.filter((video) => {
        const owner = getVideoOwner(video.owner);
        return !!owner?._id && filteredChannelIds.has(owner._id);
    });

    if (loading) {
        return <div className="p-8 text-center animate-pulse">Loading subscriptions...</div>;
    }

    return (
        <div className="p-4 lg:p-6 space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-110 transition-transform cursor-pointer">
                            <Star size={24} fill="currentColor" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight leading-none">Your Subscriptions</h1>
                    </div>
                    <p className="text-muted-foreground font-semibold italic text-sm pt-1 pl-1">Keep up with the creators that inspire you on echoStream.</p>
                </div>
                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search your creators..."
                        className="w-full bg-muted/20 border border-border rounded-full py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm group-hover:bg-muted/40"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {filteredSubscriptions.length === 0 ? (
                <div className="py-24 text-center space-y-4">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30 border border-border">
                        <UserCheck size={40} />
                    </div>
                    <h2 className="text-xl font-bold">No subscriptions yet</h2>
                    <p className="text-muted-foreground font-medium">When you subscribe to channels, they appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredSubscriptions.map((sub) => (
                        <div key={sub._id} className="group flex flex-col items-center bg-muted/10 p-8 rounded-3xl border border-transparent hover:border-border/50 transition-all hover:bg-muted/20 animate-fade-in relative">
                            <div className="absolute top-4 right-4">
                                <Bell size={16} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer" />
                            </div>
                            
                            <img 
                                src={sub.channel.avatar} 
                                alt={sub.channel.fullname} 
                                className="w-32 h-32 rounded-3xl border-4 border-white dark:border-zinc-900 shadow-2xl object-cover hover:rotate-2 transition-transform duration-500 cursor-pointer"
                                onClick={() => navigate(`/channel/${sub.channel.username}`)}
                            />
                            
                            <div 
                                className="mt-6 text-center space-y-1 cursor-pointer"
                                onClick={() => navigate(`/channel/${sub.channel.username}`)}
                            >
                                <h3 className="font-black text-xl group-hover:text-primary transition-colors leading-tight truncate px-2">{sub.channel.fullname}</h3>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest lowercase">@{sub.channel.username}</p>
                            </div>
                            
                            <button 
                                onClick={() => handleUnsubscribe(sub._id, sub.channel._id)}
                                className="mt-8 bg-muted text-muted-foreground font-black px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest border border-border hover:bg-red-500 hover:text-white hover:border-red-600 transition-all active:scale-95 shadow-sm"
                            >
                                Unsubscribe
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <section className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight">Latest From Subscribed Channels</h2>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        {filteredVideos.length} videos
                    </span>
                </div>

                {filteredVideos.length === 0 ? (
                    <div className="py-14 text-center space-y-3 rounded-3xl border border-dashed border-border bg-muted/10">
                        <Play size={36} className="mx-auto text-muted-foreground/30" />
                        <p className="text-muted-foreground font-medium">No videos from your current subscription filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredVideos.map((video) => {
                            const owner = getVideoOwner(video.owner);
                            return (
                                <div
                                    key={video._id}
                                    onClick={() => navigate(`/watch/${video._id}`)}
                                    className="group cursor-pointer rounded-2xl border border-border/50 bg-muted/10 overflow-hidden hover:border-primary/40 transition-all"
                                >
                                    <div className="relative aspect-video overflow-hidden bg-muted">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="p-3 space-y-2">
                                        <h3 className="font-black text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                            {video.title}
                                        </h3>
                                        <p
                                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (owner?.username) {
                                                    navigate(`/channel/${owner.username}`);
                                                }
                                            }}
                                        >
                                            {owner?.fullname || "Unknown Creator"}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black tracking-wider">
                                            <span className="flex items-center gap-1"><Eye size={11} className="text-primary" /> {video.views}</span>
                                            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                            <span className="flex items-center gap-1 truncate"><Clock size={11} className="text-primary" /> {formatDateDDMMYYYY(video.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Subscriptions;
