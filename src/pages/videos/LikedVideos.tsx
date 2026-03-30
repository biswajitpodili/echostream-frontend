import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { Play, ThumbsUp, Eye, Clock } from "lucide-react";
import { formatDateDDMMYYYY } from "@/lib/utils";

const LikedVideos = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                const response = await api.get("/likes/videos");
                setVideos(response.data.data);
            } catch (error) {
                console.error("Error fetching liked videos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedVideos();
    }, []);

    if (loading) {
        return <div className="p-8 text-center animate-pulse">Loading liked videos...</div>;
    }

    return (
        <div className="p-4 lg:p-6 space-y-8">
            <header className="flex flex-col gap-2 border-b border-border pb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <ThumbsUp size={24} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Liked Videos</h1>
                </div>
                <p className="text-muted-foreground font-medium italic text-sm">Your personal collection of masterpieces.</p>
            </header>

            {videos.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                        <ThumbsUp size={40} />
                    </div>
                    <h2 className="text-xl font-bold">No liked videos yet</h2>
                    <p className="text-muted-foreground transition-all">Start exploring and show some love to your favorite creators!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <div 
                            key={video._id}
                            onClick={() => navigate(`/watch/${video._id}`)}
                            className="group cursor-pointer space-y-3 bg-muted/20 p-3 rounded-2xl border border-transparent hover:border-border/50 transition-all hover:bg-muted/40"
                        >
                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-md">
                                <img 
                                    src={video.thumbnail} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    alt={video.title} 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Play size={32} className="text-white fill-white" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                    {video.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                                        <img src={video.owner?.avatar} alt={video.owner?.fullname} />
                                    </div>
                                    <span className="text-xs font-black uppercase text-muted-foreground truncate italic">
                                        {video.owner?.fullname}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-wider text-muted-foreground/60">
                                    <span className="flex items-center gap-1"><Eye size={12} /> {video.views}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {formatDateDDMMYYYY(video.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikedVideos;
