import { useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { Search, ArrowRight, Users, Video, ArrowLeft } from "lucide-react";

interface ChannelResult {
    _id: string;
    fullname: string;
    username: string;
    avatar: string;
    email: string;
    subscribersCount?: number;
}

const ChannelSearch = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<ChannelResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            // Search for channel by username
            const response = await api.get(`/users/c/${searchTerm.trim()}`);
            if (response.data.data) {
                setResults([response.data.data]);
            } else {
                setResults([]);
            }
        } catch (error) {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChannelClick = (username: string) => {
        navigate(`/channel/${username}`);
    };

    return (
        <div className="min-h-screen bg-background p-4 lg:p-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-2xl transition-colors font-black uppercase text-xs tracking-widest text-muted-foreground hover:text-primary mb-8"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl lg:text-6xl font-black tracking-tighter">
                        Find <span className="text-primary">Creators</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-semibold max-w-xl mx-auto">
                        Search for creators and explore their channels on echoStream
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
                        <input
                            type="text"
                            placeholder="Search by username..."
                            className="w-full bg-muted/20 border-2 border-border rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-lg group-hover:bg-muted/40"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-2xl font-black uppercase tracking-widest text-base shadow-xl shadow-primary/30 hover:scale-105 transition-transform active:scale-95"
                    >
                        Search Channel
                    </button>
                </form>

                {/* Results */}
                <div className="space-y-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {searched && !loading && results.length === 0 && (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30 border border-border">
                                <Search size={40} />
                            </div>
                            <h3 className="text-2xl font-black">Channel not found</h3>
                            <p className="text-muted-foreground font-semibold">
                                Try searching with a different username
                            </p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="space-y-4">
                            {results.map((channel) => (
                                <div
                                    key={channel._id}
                                    className="group bg-muted/10 border border-border rounded-3xl p-6 hover:border-primary/50 hover:bg-muted/20 transition-all cursor-pointer"
                                    onClick={() => handleChannelClick(channel.username)}
                                >
                                    <div className="flex items-center gap-6">
                                        <img
                                            src={channel.avatar}
                                            alt={channel.fullname}
                                            className="w-24 h-24 rounded-2xl border-2 border-primary/20 object-cover group-hover:scale-110 transition-transform"
                                        />
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-2xl font-black group-hover:text-primary transition-colors">
                                                    {channel.fullname}
                                                </h3>
                                                <p className="text-muted-foreground font-black uppercase text-sm tracking-widest lowercase">
                                                    @{channel.username}
                                                </p>
                                            </div>
                                            <p className="text-muted-foreground font-semibold text-sm">{channel.email}</p>
                                            {channel.subscribersCount !== undefined && (
                                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={14} className="text-primary" />
                                                        {channel.subscribersCount} Subscribers
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-primary group-hover:translate-x-2 transition-transform">
                                            <ArrowRight size={32} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!searched && results.length === 0 && (
                        <div className="text-center py-12 space-y-4 bg-muted/10 rounded-3xl border-2 border-dashed border-border">
                            <Video size={48} className="mx-auto text-muted-foreground/30" />
                            <p className="text-muted-foreground font-semibold text-lg">
                                Start searching to find creators
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChannelSearch;
