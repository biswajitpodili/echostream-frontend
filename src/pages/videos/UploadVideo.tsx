import React, { useState } from "react";
import { Upload, FileVideo, ImageIcon, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const UploadVideo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "transcoding" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!video || !thumbnail || !title || !description) return;

        setIsUploading(true);
        setUploadStatus("uploading");
        setErrorMessage("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", video);
        formData.append("thumbnail", thumbnail);

        try {
            // Note: Our backend does transcoding on same request, which may take time. 
            // In a better architecture we'd use webhooks/websockets for status.
            const response = await api.post("/videos/upload-video", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                  const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                  if (progress === 100) {
                      setUploadStatus("transcoding");
                  }
                }
            });
            
            if (response.status === 201) {
                setUploadStatus("success");
            }
        } catch (error: any) {
            console.error("Upload error", error);
            setUploadStatus("error");
            setErrorMessage(error.response?.data?.message || "Failed to upload video. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (uploadStatus === "success") {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold">Video Uploaded Successfully!</h2>
                <p className="text-muted-foreground max-w-md">
                    Your video has been transcoded to HLS and is now ready for streaming in 360p, 480p, and 720p.
                </p>
                <button 
                  onClick={() => { setUploadStatus("idle"); setTitle(""); setDescription(""); setVideo(null); setThumbnail(null); }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                    Upload Another
                </button>
            </div>
        );
    }

    return (
        <div className=" mx-auto p-4 lg:p-8 space-y-8">
            <header className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                    <Upload size={20} />
                </div>
                <div>
                   <h1 className="text-2xl font-bold">Upload Video</h1>
                   <p className="text-sm text-muted-foreground">Share your content with the world. We'll handle the adaptive bitrate transcoding.</p>
                </div>
            </header>

            <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Video Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a catchy title"
                            className="w-full bg-muted/50 border border-border px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell viewers about your video"
                            className="w-full h-32 bg-muted/50 border border-border px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                            required
                        />
                    </div>

                    <div className="p-4 bg-muted/30 rounded-xl border border-dashed border-border text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                            <ImageIcon size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Video Thumbnail</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG (max 5MB)</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="hidden"
                            id="thumbnail-upload"
                            required
                        />
                        <label 
                          htmlFor="thumbnail-upload"
                          className="inline-block px-4 py-2 bg-secondary rounded-lg text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                        >
                            {thumbnail ? thumbnail.name : "Select Image"}
                        </label>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={cn(
                        "aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 space-y-4 group hover:border-primary transition-colors cursor-pointer",
                        video ? "bg-primary/5 border-primary/50" : "bg-muted/50"
                    )}>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideo(e.target.files?.[0] || null)}
                            className="hidden"
                            id="video-upload"
                            required
                        />
                        <label 
                          htmlFor="video-upload"
                          className="flex flex-col items-center text-center cursor-pointer space-y-4"
                        >
                            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                {video ? <CheckCircle2 size={32} /> : <FileVideo size={32} />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold">{video ? "Video Selected" : "Select Video File"}</p>
                                <p className="text-sm text-muted-foreground">{video ? video.name : "MP4, MOV, AVI (max 500MB)"}</p>
                            </div>
                            <span className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                                {video ? "Change File" : "Choose File"}
                            </span>
                        </label>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        By submitting your videos to echoStream, you acknowledge that you agree to echoStream's Terms of Service and Community Guidelines.
                    </p>

                    <button
                        type="submit"
                        disabled={isUploading || !video || !thumbnail || !title || !description}
                        className={cn(
                            "w-full py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2",
                            isUploading 
                                ? "bg-muted text-muted-foreground" 
                                : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                        )}
                    >
                        {uploadStatus === "uploading" && <Loader2 className="animate-spin" />}
                        {uploadStatus === "transcoding" && <Loader2 className="animate-spin" />}
                        {uploadStatus === "uploading" ? "Uploading Content..." : 
                         uploadStatus === "transcoding" ? "Transcoding (this may take a few minutes)..." : 
                         "Publish Video"}
                    </button>

                    {uploadStatus === "error" && (
                        <div className="p-4 bg-red-500/10 text-red-500 rounded-xl flex items-start gap-2 border border-red-500/20">
                            <AlertCircle className="shrink-0 mt-0.5" size={16} />
                            <p className="text-sm">{errorMessage}</p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default UploadVideo;
