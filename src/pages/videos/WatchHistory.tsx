import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { Play, Clock, Eye, Trash2 } from "lucide-react";
import { formatDateDDMMYYYY } from "@/lib/utils";

const WatchHistory = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get("/users/history");
                setHistory(response.data.data);
            } catch (error) {
                console.error("Error fetching watch history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div className="p-8 text-center animate-pulse">Loading history...</div>;
    }

    return (
        <div className="p-4 lg:p-6 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Watch History</h1>
                    <p className="text-muted-foreground font-medium italic text-sm pt-1">Revisit your favorite echoStream moments.</p>
                </div>
                <button className="flex items-center gap-2 text-xs font-black uppercase text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-full transition-colors">
                    <Trash2 size={14} /> Clear History
                </button>
            </header>

            {history.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-xl font-bold">No history available</h2>
                    <p className="text-muted-foreground">Videos you watch will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {history.map((video) => (
                        <div 
                            key={video._id}
                            onClick={() => navigate(`/watch/${video._id}`)}
                            className="group flex flex-col md:flex-row gap-6 p-4 rounded-3xl hover:bg-muted/30 transition-all cursor-pointer border border-transparent hover:border-border/50"
                        >
                            <div className="relative md:w-80 aspect-video rounded-2xl overflow-hidden shadow-lg shrink-0">
                                <img 
                                    src={video.thumbnail} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt={video.title} 
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                                        <Play size={24} fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3 pt-1">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black group-hover:text-primary transition-colors leading-tight">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground opacity-80">
                                        <span className="flex items-center gap-1"><Eye size={12} className="text-primary" /> {video.views} Views</span>
                                        <span>•</span>
                                        <span>{video.owner?.fullname}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 italic leading-relaxed">
                                    {video.description}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] bg-primary/10 text-primary w-fit px-3 py-1 rounded-full font-black uppercase">
                                    <Clock size={10} /> Watched {formatDateDDMMYYYY(video.updatedAt)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchHistory;
