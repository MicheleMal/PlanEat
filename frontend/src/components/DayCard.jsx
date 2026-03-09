import MealSection from "./MealSection";

const mealOrder = ["Colazione", "Pranzo", "Merenda", "Aperitivo", "Cena"];

export default function DayCard({ date, meals, onEdit, onDelete }) {
    const sortedMeals = [...meals].sort(
        (a, b) => mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType),
    );

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                    📅{" "}
                    {new Date(date).toLocaleDateString("it-IT", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    })}
                </h2>

                {sortedMeals.map((meal) => (
                    <div key={meal.id} className="mb-4">
                        <MealSection
                            type={meal.mealType}
                            recipes={meal.mealRecipe}
                        />

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => onEdit(meal)}
                                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-white text-xs"
                            >
                                Modifica
                            </button>

                            <button
                                onClick={() => onDelete(meal.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-xs"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
