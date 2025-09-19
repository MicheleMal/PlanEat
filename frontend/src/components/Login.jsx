import { useState } from "react";
import { signin, signup } from "../service/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const { access_token } = await signin(user);

                localStorage.setItem("token", access_token);

                navigate("/");
            } catch (error) {
                setError(error.response.data.message);
            }
        } else {
            try {
                await signup(user);

                setIsLogin(true);
            } catch (error) {
                console.error(error);
            }
        }

        setUser({
            name: "",
            email: "",
            password: "",
        });
    };

    return (
        <div className="bg-gray-950 min-h-screen flex items-center justify-center px-4">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">
                    {isLogin ? "Accedi" : "Registrati"}
                </h1>

                {error && (
                    <div className="bg-red-600 text-white p-2 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={(e) =>
                                    setUser({ ...user, name: e.target.value })
                                }
                                placeholder="Il tuo nome"
                                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
                    >
                        {isLogin ? "Accedi" : "Registrati"}
                    </button>
                </form>

                <p className="mt-6 text-gray-400 text-center text-sm">
                    {isLogin ? "Non hai un account?" : "Hai già un account?"}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline"
                    >
                        {isLogin ? "Registrati" : "Accedi"}
                    </button>
                </p>
            </div>
        </div>
    );
}
