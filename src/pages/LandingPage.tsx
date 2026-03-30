import { useNavigate } from "react-router";
import { Play, TrendingUp, Users, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Lightning Fast",
            description: "Experience crystal clear streaming with adaptive bitrate technology",
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Grow Your Audience",
            description: "Share your content with viewers worldwide and build your community",
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Connect & Engage",
            description: "Like, comment, and subscribe to your favorite creators instantly",
        },
    ];

    const benefits = [
        "4K streaming support",
        "Unlimited uploads",
        "Ad-free experience",
        "Direct messaging",
        "Monetization tools",
        "Analytics dashboard",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 lg:px-12 py-6 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                        <Play size={24} className="text-white fill-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">echoStream</span>
                </div>
                <Button 
                    onClick={() => navigate("/login")}
                    className="px-8 py-2 bg-primary text-white hover:scale-105 transition-transform"
                >
                    Sign In
                </Button>
            </nav>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-32 space-y-8">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Join the revolution</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
                        Your <span className="text-primary">Voice</span> Deserves to Be <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Heard</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-semibold">
                        echoStream is the next generation streaming platform where creators share their passion and audiences discover amazing content. Say hello to ultra-fast HLS streaming, crystal clear quality, and a community that truly cares.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-8">
                        <Button
                            onClick={() => navigate("/login")}
                            size="lg"
                            className="px-8 py-3 bg-primary text-white hover:scale-105 transition-transform font-black uppercase tracking-widest text-base shadow-xl shadow-primary/30"
                        >
                            Get Started Free <ArrowRight size={20} className="ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8 py-3 font-black uppercase tracking-widest text-base border-2"
                        >
                            Watch Demo
                        </Button>
                    </div>
                </div>

                {/* Hero Image Placeholder */}
                <div className="relative mt-16 rounded-[2.5rem] overflow-hidden border border-primary/20 bg-black/20 backdrop-blur">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group">
                            <Play size={48} className="text-primary fill-primary group-hover:scale-125 transition-transform" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-6 lg:px-12 py-20 space-y-12">
                <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter">Why Choose <span className="text-primary">echoStream?</span></h2>
                    <p className="text-muted-foreground text-lg max-w-2xl font-semibold">
                        We're built for creators and viewers who demand excellence. Here's what sets us apart.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, i) => (
                        <div key={i} className="p-8 rounded-2xl border border-border/50 hover:border-primary/50 bg-muted/20 hover:bg-primary/5 transition-all group hover:shadow-xl hover:shadow-primary/10">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-black mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground font-semibold leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="max-w-6xl mx-auto px-6 lg:px-12 py-20 space-y-12">
                <div className="grid gap-12 md:grid-cols-2 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4">Everything You Need to <span className="text-primary">Succeed</span></h2>
                            <p className="text-muted-foreground text-lg font-semibold">
                                From upload to monetization, we've got everything a modern creator needs.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-primary shrink-0" />
                                    <span className="text-base font-black uppercase tracking-widest">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => navigate("/login")}
                            size="lg"
                            className="px-8 py-3 bg-primary text-white hover:scale-105 transition-transform font-black uppercase tracking-widest text-base shadow-xl shadow-primary/30 w-fit"
                        >
                            Start Streaming Today <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-2xl border border-primary/20 bg-black/20 backdrop-blur flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/30 flex items-center justify-center">
                                <Play size={64} className="text-primary fill-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-6xl mx-auto px-6 lg:px-12 py-20">
                <div className="rounded-[2.5rem] bg-gradient-to-r from-primary via-primary to-primary/60 p-12 lg:p-16 space-y-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
                        Ready to Make Your Mark?
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto font-semibold">
                        Join thousands of creators and viewers on echoStream. Start for free, no credit card required.
                    </p>
                    <Button
                        onClick={() => navigate("/login")}
                        size="lg"
                        className="px-12 py-3 bg-white text-primary hover:scale-105 transition-transform font-black uppercase tracking-widest text-base mx-auto"
                    >
                        Sign Up Now <ArrowRight size={20} className="ml-2" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 mt-20">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
                    <div className="grid gap-8 md:grid-cols-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                                    <Play size={16} className="text-white fill-white" />
                                </div>
                                <span className="font-black tracking-tighter">echoStream</span>
                            </div>
                            <p className="text-sm text-muted-foreground">The future of video streaming</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-black uppercase text-sm tracking-widest">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-black uppercase text-sm tracking-widest">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-black uppercase text-sm tracking-widest">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2026 echoStream. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
