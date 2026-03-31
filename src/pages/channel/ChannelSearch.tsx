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

            <div className="mx-auto max-w-3xl space-y-10 sm:space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-black tracking-tighter sm:text-5xl lg:text-6xl">
                        Find <span className="text-primary">Creators</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base font-semibold text-muted-foreground sm:text-lg">
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
                            className="w-full rounded-2xl border-2 border-border bg-muted/20 py-3 pl-12 pr-4 text-base font-semibold transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 group-hover:bg-muted/40 sm:py-4 sm:pl-14 sm:pr-6 sm:text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white dark:text-black py-3 rounded-2xl font-black uppercase tracking-widest text-base shadow-xl shadow-primary/30 hover:scale-105 transition-transform active:scale-95"
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
                                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                                        <img
                                            src={channel.avatar}
                                            alt={channel.fullname}
                                            className="h-20 w-20 rounded-2xl border-2 border-primary/20 object-cover transition-transform group-hover:scale-110 sm:h-24 sm:w-24"
                                        />
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-xl font-black transition-colors group-hover:text-primary sm:text-2xl">
                                                    {channel.fullname}
                                                </h3>
                                                <p className="text-muted-foreground font-black uppercase text-sm tracking-widest lowercase">
                                                    @{channel.username}
                                                </p>
                                            </div>
                                            <p className="break-all text-sm font-semibold text-muted-foreground">{channel.email}</p>
                                            {channel.subscribersCount !== undefined && (
                                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={14} className="text-primary" />
                                                        {channel.subscribersCount} Subscribers
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="self-end text-primary transition-transform group-hover:translate-x-2 sm:self-center">
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
