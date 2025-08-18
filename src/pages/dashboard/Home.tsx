

const Home = () => {
  return (
    <div className="grid auto-rows-min gap-2 sm:grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 200 }).map((_, i) => (
        <div className="hover:bg-muted/50 transition-colors rounded-xl overflow-hidden cursor-pointer p-2">
          <div key={i} className="bg-muted/50 aspect-video rounded-xl" />
          <div className="p-3 space-y-2">
            <h3 className="font-medium text-sm line-clamp-2">
              Video Title Here
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold">C</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  Channel Name
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>1.2M views</span>
                  <span>•</span>
                  <span>2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
