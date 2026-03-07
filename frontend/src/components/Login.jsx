import { useState } from "react";
import { signin, signup } from "../service/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();

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
                login(access_token);
                navigate("/");
            } catch (error) {
                setError(error.response?.data?.message || "Errore di login");
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
        <div className="bg-zinc-950 min-h-screen flex items-center justify-center px-6">
            <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-zinc-800">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? "Accedi a PlanEat" : "Crea un account"}
                </h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 p-2 rounded mb-4 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={user.name}
                                onChange={(e) =>
                                    setUser({ ...user, name: e.target.value })
                                }
                                placeholder="Il tuo nome"
                                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium text-zinc-900 transition"
                    >
                        {isLogin ? "Accedi" : "Registrati"}
                    </button>
                </form>

                <p className="mt-6 text-zinc-400 text-center text-sm">
                    {isLogin ? "Non hai un account?" : "Hai già un account?"}{" "}
                    <button
                        onClick={() => {
                            setError("");
                            setIsLogin(!isLogin);
                        }}
                        className="text-emerald-400 hover:underline"
                    >
                        {isLogin ? "Registrati" : "Accedi"}
                    </button>
                </p>
            </div>
        </div>
    );
}
