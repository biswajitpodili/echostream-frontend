import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { Users, UserCheck, Search, MoreHorizontal } from "lucide-react";
import { formatDateDDMMYYYY } from "@/lib/utils";

const YourSubscribers = () => {
    const navigate = useNavigate();
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const response = await api.get("/subscriptions/subscribers");
                setSubscribers(response.data.data);
            } catch (error) {
                console.error("Error fetching subscribers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    const filteredSubscribers = subscribers.filter(s => 
        s.subscriber.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subscriber.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center animate-pulse">Loading audience data...</div>;
    }

    return (
        <div className="p-4 lg:p-6 space-y-8">
            <header className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary">
                            <Users size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Community</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Your Subscribers</h1>
                        <p className="text-muted-foreground font-medium italic text-sm pt-1">The people who believe in your echoStream voice.</p>
                    </div>
                    <div className="bg-primary text-white px-6 py-2 rounded-2xl font-black shadow-lg flex items-center gap-2">
                        <UserCheck size={20} />
                        {subscribers.length} Total
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search your subscribers..."
                        className="w-full bg-muted/30 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {filteredSubscribers.length === 0 ? (
                <div className="py-20 text-center space-y-4 bg-muted/10 rounded-3xl border border-dashed border-border">
                    <Users size={48} className="mx-auto text-muted-foreground/30" />
                    <p className="text-muted-foreground font-medium">No subscribers found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubscribers.map((sub) => (
                        <div 
                            key={sub._id} 
                            className="group bg-muted/20 p-5 rounded-3xl border border-transparent hover:border-border/50 hover:bg-white dark:hover:bg-neutral-900 transition-all shadow-sm hover:shadow-xl cursor-pointer"
                            onClick={() => navigate(`/channel/${sub.subscriber.username}`)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img 
                                        src={sub.subscriber.avatar} 
                                        alt={sub.subscriber.fullname} 
                                        className="w-16 h-16 rounded-2xl border-2 border-primary/20 p-0.5 object-cover"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-neutral-900 rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-lg truncate group-hover:text-primary transition-colors">{sub.subscriber.fullname}</h3>
                                    <p className="text-xs text-muted-foreground font-bold tracking-tight lowercase truncate">@{sub.subscriber.username}</p>
                                </div>
                                <button 
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                                >
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center bg-muted/30 -mx-5 -mb-5 px-5 py-3 rounded-b-3xl">
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Subscribed</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{formatDateDDMMYYYY(sub.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default YourSubscribers;
