import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [token, setToken] = useState(false)

    const links = [
        { name: "Home", path: "/" },
        { name: "Ricette", path: "/ricette" },
        { name: "Pasti", path: "/pasti" },
        { name: "Liste della spesa", path: "/liste" },
    ];

    useEffect(()=>{
        setToken(localStorage.getItem("token"))
    },[token])

    return (
        <nav className="bg-gray-900 text-gray-300 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo + Links */}
                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 text-xl font-bold text-white">
                            PlanEat
                        </div>

                        {/* Desktop menu links aligned left */}
                        <div className="hidden md:flex space-x-4">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                    ${
                        location.pathname === link.path
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white"
                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Login aligned right */}
                    <div className="hidden md:flex">
                        <Link
                            to={token ? "/profile" : "/login"}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${
                    location.pathname === "/login"
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white"
                }`}
                        >
                            {token ? "Profilo" : "Login"}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 
                ${
                    location.pathname === link.path
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white"
                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link
                        to={token ? "/profile" : "/login"}
                        onClick={() => setIsOpen(false)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 
              ${
                  location.pathname === "/login"
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white"
              }`}
                    >
                        {token ? "Profilo" : "Login"}
                    </Link>
                </div>
            )}
        </nav>
    );
}
