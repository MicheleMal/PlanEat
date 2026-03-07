import { Github } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col items-center justify-center px-6">
                {/* Hero Section */}
                <div className="max-w-3xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Benvenuto su{" "}
                        <span className="text-emerald-400">PlanEat</span>
                    </h1>

                    <p className="text-lg text-zinc-400 mb-8">
                        Organizza ricette, pasti e liste della spesa con
                        facilità. Tutto in un unico posto.
                    </p>

                    {/* GitHub button */}
                    <a
                        href="https://github.com/MicheleMal/PlanEat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-shadow shadow-xl"
                    >
                        <Github className="h-5 w-5" />
                        Vai alla Repo GitHub
                    </a>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-zinc-500 text-sm">
                    © {new Date().getFullYear()} PlanEat. Tutti i diritti
                    riservati.
                </footer>
            </div>
        </>
    );
}
