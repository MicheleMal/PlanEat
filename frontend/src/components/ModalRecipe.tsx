import { X } from "lucide-react";
import type { Recipe } from "../types/recipe";

interface ModalRecipe {
    selected: Recipe;
    setSelected: (value: Recipe | null) => void;
}

export default function ModalRecipe({ selected, setSelected }: ModalRecipe) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg relative shadow-lg">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    onClick={() => setSelected(null)}
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">
                    {selected.title}
                </h2>
                <p className="text-gray-400 mb-2">{selected.description}</p>
                <p className="text-gray-400 mb-4">
                    Tempo: {selected.prepTime} minuti
                </p>
                <h3 className="text-lg font-semibold text-white mb-2">
                    Ingredienti
                </h3>
                <ul className="list-disc list-inside text-gray-300">
                    {selected.recipeIngredient.map((ing, i) => (
                        <li key={i}>
                            {ing.ingredient.name} - {ing.quantity} {ing.unit}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
