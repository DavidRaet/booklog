const LoadingState = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-secondary">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-primary animate-pulse">
                    Loading Books
                </h2>
                <p className="text-primary/60 mt-2">Curating your library...</p>
            </div>

            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingState;
