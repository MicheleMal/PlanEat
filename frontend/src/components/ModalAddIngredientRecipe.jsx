import { X } from "lucide-react";
import { useState } from "react";
import AddIngredients from "./AddIngredients";

export default function ModalAddIngredientRecipe({
    setShowForm,
    addIngredientRecipe,
    idRecipe,
}) {
    const [ingredients, setIngredients] = useState([]);

    const handleAddIngredient = (newIngredient) => {
        setIngredients((prev) => [...prev, newIngredient]);
    };

    const handleSave = () => {
        addIngredientRecipe(ingredients, idRecipe);
    };

    const handleClose = () => {
        setShowForm((prev) => ({
            ...prev,
            addIngredient: false,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl relative shadow-xl overflow-y-auto max-h-[90vh]">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    Nuovi Ingredienti
                </h2>

                <div className="space-y-4">
                    <AddIngredients
                        ingredients={ingredients}
                        onAddIngredient={handleAddIngredient}
                    />

                    <button
                        onClick={handleSave}
                        disabled={ingredients.length === 0}
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white"
                    >
                        Salva Ingredienti
                    </button>
                </div>
            </div>
        </div>
    );
}
