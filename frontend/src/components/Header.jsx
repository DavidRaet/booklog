// -----------------------------------------------------
// | BookLog |  [ Home | Library | Favorites ]   | About |
// -----------------------------------------------------

const Header = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-800">
                    📘 BookLog
                </div>
                <nav className="flex gap-8">
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Home
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Library
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Favorites
                    </a>
                </nav>
                <div>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                        About
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header; 
