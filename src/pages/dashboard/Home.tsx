import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { formatDateDDMMYYYY } from "@/lib/utils";
import { Video as VideoIcon, Play, Eye, Clock } from "lucide-react";

interface Video {
    _id: string;
    title: string;
    thumbnail: string;
    owner: {
        fullname: string;
        username: string;
        avatar: string;
    };
    views: number;
    duration: number;
    createdAt: string;
}

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/videos");
        setVideos(response.data.data);
      } catch (error) {
        console.error("Error fetching videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="grid auto-rows-min gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="bg-muted aspect-video rounded-2xl" />
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <VideoIcon size={48} />
        </div>
        <div className="space-y-2">
            <h2 className="text-2xl font-bold">No videos found!</h2>
            <p className="text-muted-foreground">Be the first to upload an HLS transcoded video to echoStream.</p>
        </div>
        <button 
          onClick={() => navigate("/channel/upload-video")}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
        >
          Upload Your First Video
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-10">
        {/* Banner - Hero Section */}
        {/* Redesigned Hero Section */}

       

        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Latest Discoveries
                        <div className="flex gap-1 items-center">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                           
                        </div>
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium italic">Handpicked videos optimized for your connection.</p>
                </div>
               
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 xl:grid-cols-5 items-stretch">
                {videos.map((video) => {
                    const owner = video.owner;
                    return (
                        <div 
                            key={video._id} 
                            onClick={() => navigate(`/watch/${video._id}`)}
                    className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted/10 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                        >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl relative">
                                        <div className="absolute inset-0 bg-primary animate-ping rounded-full opacity-20" />
                                        <Play size={28} fill="currentColor" className="relative z-10 ml-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-1 min-w-0 flex-col gap-2.5 p-2.5 sm:p-3">
                              <h3 className="min-w-0 font-black text-[13px] sm:text-sm md:text-base leading-tight sm:leading-[1.3] group-hover:text-primary transition-colors tracking-tight break-words">
                                {video.title}
                              </h3>

                              <div className="mt-auto flex min-w-0 items-center gap-2.5">
                                <div className="relative shrink-0 pt-0.5">
                                  <img
                                    src={owner?.avatar}
                                    alt={owner?.fullname}
                                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-primary/20 border-2 border-transparent group-hover:border-primary/50 group-hover:rotate-6 transition-all duration-500 object-cover shadow-lg"
                                  />
                                </div>

                                <div className="min-w-0 flex-1 space-y-1 overflow-hidden flex justify-center flex-col items-start">
                                  <p className="truncate text-[10px] sm:text-[11px] font-black uppercase text-muted-foreground hover:text-primary transition-colors tracking-[0.08em] sm:tracking-[0.1em]">
                                    {owner?.fullname}
                                  </p>
                                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden whitespace-nowrap text-[9px] sm:text-[10px] text-muted-foreground uppercase font-black tracking-wider sm:tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span className="flex items-center gap-1"><Eye size={12} className="text-primary" /> {video.views}</span>
                                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                    <span className="flex items-center gap-1 truncate"><Clock size={12} className="text-primary" /> {formatDateDDMMYYYY(video.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default Home;
