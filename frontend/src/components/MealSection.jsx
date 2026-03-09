import RecipeTag from "./RecipeTag";

export default function MealSection({ type, recipes }) {
    if (!recipes || recipes.length === 0) return null;

    const mealColors = {
        Colazione: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        Pranzo: "bg-green-500/20 text-green-300 border-green-500/30",
        Merenda: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        Cena: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        Aperitivo: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    };

    return (
        <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
                <span
                    className={`text-xs px-2 py-1 rounded-md border ${mealColors[type]}`}
                >
                    {type}
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {recipes.map((r) => (
                    <RecipeTag key={r.id} label={r.recipe.title} />
                ))}
            </div>
        </div>
    );
}
