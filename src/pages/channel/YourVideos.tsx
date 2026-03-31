import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { Play, Edit2, Trash2, Eye, LayoutGrid, List, FileVideo } from "lucide-react";
import { cn, formatDateDDMMYYYY } from "@/lib/utils";

const YourVideos = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchYourVideos = async () => {
            try {
                const response = await api.get("/videos/user-videos");
                setVideos(response.data.data);
            } catch (error) {
                console.error("Error fetching your videos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchYourVideos();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) return;
        try {
            await api.delete(`/videos/delete-video/${id}`);
            setVideos(videos.filter(v => v._id !== id));
        } catch (error) {
            console.error("Error deleting video", error);
            alert("Failed to delete video");
        }
    };

    if (loading) {
        return <div className="p-8 text-center animate-pulse">Loading your channel...</div>;
    }

    return (
        <div className="space-y-8 p-4 lg:p-6">
            <header className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center md:gap-6 md:pb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter sm:text-4xl">Your Videos</h1>
                    <p className="text-muted-foreground font-semibold italic text-sm">Manage and monitor your digital broadcast empire.</p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/30 p-1.5">
                    <button 
                        onClick={() => setViewMode("grid")}
                        className={cn("p-2 rounded-xl transition-all", viewMode === "grid" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-muted")}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button 
                        onClick={() => setViewMode("list")}
                        className={cn("p-2 rounded-xl transition-all", viewMode === "list" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-muted")}
                    >
                        <List size={20} />
                    </button>
                </div>
            </header>

            {videos.length === 0 ? (
                <div className="py-24 text-center space-y-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
                        <FileVideo size={48} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black">Your studio is empty!</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto font-medium">Upload your first masterpiece and start building your audience today.</p>
                    </div>
                    <button 
                        onClick={() => navigate("/channel/upload-video")}
                        className="bg-primary text-white px-8 py-3 rounded-full font-black uppercase text-sm shadow-xl hover:scale-105 transition-transform"
                    >
                        Upload Video
                    </button>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {videos.map((video) => (
                        <div key={video._id} className="group relative bg-muted/10 rounded-3xl overflow-hidden border border-border/50 hover:shadow-2xl transition-all">
                            <div className="relative aspect-video">
                                <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Play 
                                        size={40} 
                                        className="text-white fill-white cursor-pointer hover:scale-110 transition-transform" 
                                        onClick={() => navigate(`/watch/${video._id}`)}
                                    />
                                </div>
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    <button className="bg-white/90 p-2.5 rounded-full text-black hover:bg-primary hover:text-white shadow-lg transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(video._id)}
                                        className="bg-white/90 p-2.5 rounded-full text-red-600 hover:bg-red-600 hover:text-white shadow-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <h3 className="font-black leading-tight line-clamp-2">{video.title}</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                        <span className="flex items-center gap-1"><Eye size={12} className="text-primary" /> {video.views}</span>
                                        <span>•</span>
                                        <span>{formatDateDDMMYYYY(video.createdAt)}</span>
                                    </div>
                                    {video.videoFile.includes(".m3u8") && (
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-primary/20">HLS</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-border bg-muted/10">
                    <table className="w-full min-w-[640px] text-left">
                        <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <tr>
                                <th className="p-4 sm:p-6">Video</th>
                                <th className="p-4 sm:p-6">Upload Date</th>
                                <th className="p-4 sm:p-6">Views</th>
                                <th className="p-4 text-right sm:p-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {videos.map((video) => (
                                <tr key={video._id} className="group hover:bg-muted/30 transition-all">
                                    <td className="p-4 sm:p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={video.thumbnail} className="w-24 h-14 object-cover rounded-xl shadow-md" alt={video.title} />
                                            <div className="space-y-1">
                                                <div className="font-black text-sm group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/watch/${video._id}`)}>
                                                    {video.title}
                                                </div>
                                                <div className="text-[10px] max-w-xs truncate text-muted-foreground italic font-medium">{video.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs font-bold sm:p-6">{formatDateDDMMYYYY(video.createdAt)}</td>
                                    <td className="p-4 text-xs font-bold font-mono tracking-tighter sm:p-6">{video.views.toLocaleString()}</td>
                                    <td className="p-4 sm:p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="bg-muted p-2 rounded-xl text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(video._id)}
                                                className="bg-muted p-2 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default YourVideos;
