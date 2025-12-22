import Button from "./Button.jsx";
import { BookOpen } from "lucide-react";
const Header = ({ onLogout }) => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen size={24} color="#4e92c6" />
                    <p className="text-2xl font-bold text-gray-800">BookLog</p>
                </div>
                
                <nav className="flex gap-8 items-center">
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Home
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Library
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Favorites
                    </a>
                    <Button onClick={onLogout} variant="accent">
                        Logout
                    </Button>
                </nav>
            </div>
        </header>
    );
};

export default Header; 
