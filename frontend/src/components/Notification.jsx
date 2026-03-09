import { CheckCircle, XCircle, Info, X } from "lucide-react";

const styles = {
    success: "border-emerald-500 bg-zinc-900 text-emerald-400",
    error: "border-red-500 bg-zinc-900 text-red-400",
    info: "border-blue-500 bg-zinc-900 text-blue-400",
};

const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
};

export default function Notification({ message, type = "info", onClose }) {
    return (
        <div
            className={`flex items-center gap-3 border-l-4 px-4 py-3 rounded-lg shadow-xl backdrop-blur-sm ${styles[type]} animate-slideIn`}
        >
            {icons[type]}

            <p className="text-sm flex-1">{message}</p>

            <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition"
            >
                <X size={16} />
            </button>
        </div>
    );
}