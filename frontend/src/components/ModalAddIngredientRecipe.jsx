import { X } from "lucide-react";
import { useState } from "react";
import AddIngredients from "./AddIngredients"

export default function ModalAddIngredientRecipe({
    setShowForm,
    addIngredientRecipe,
    idRecipe,
}) {
    const [ingredients, setIngredients] = useState([]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl relative shadow-lg overflow-y-auto max-h-[90vh]">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    onClick={() =>
                        setShowForm((prev) => ({
                            ...prev,
                            addIngredient: false,
                        }))
                    }
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Nuovi Ingredienti
                </h2>
                <div className="space-y-4">
                    {/* Aggiungi ingredienti */}
                    <AddIngredients ingredients={ingredients} onAddIngredient={(newIng)=>{setIngredients([...ingredients, newIng])}}></AddIngredients>

                    <button
                        onClick={() =>
                            addIngredientRecipe(ingredients, idRecipe)
                        }
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                    >
                        Salva Ricetta
                    </button>
                </div>
            </div>
        </div>
    );
}
