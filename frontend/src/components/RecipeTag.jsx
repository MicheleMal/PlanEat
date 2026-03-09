export default function RecipeTag({ label }) {
    return (
        <span className="px-3 py-1 text-sm rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 transition cursor-pointer">
            {label}
        </span>
    );
}
