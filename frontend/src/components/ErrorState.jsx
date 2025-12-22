const ErrorState = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] w-full p-6">
            <div className="bg-white border border-red-100 rounded-xl shadow-lg p-8 max-w-md w-full text-center transform transition-all hover:scale-105 duration-300">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Content</h3>
                <p className="text-sm text-gray-500 mb-6">
                    {message || "We encountered an unexpected error while loading your books."}
                </p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorState;
