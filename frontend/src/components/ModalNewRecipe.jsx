import { X } from "lucide-react";
import { useState } from "react";
import AddIngredients from "./AddIngredients";

export default function ModelNewRecipe({ setShowForm, addRecipe }) {
    const [formDataRecipe, setformDataRecipe] = useState({
        title: "",
        description: "",
        prepTime: null,
        recipeIngredient: [],
    });

    const handleInputRecipeChange = (e) => {
        const { name, value } = e.target;

        setformDataRecipe({
            ...formDataRecipe,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addRecipe(formDataRecipe);
        setformDataRecipe({
            title: "",
            description: "",
            prepTime: null,
            recipeIngredient: [],
        });

        setShowForm((prev) => ({ ...prev, create: false }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl relative shadow-lg overflow-y-auto max-h-[90vh]">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    onClick={() =>
                        setShowForm((prev) => ({ ...prev, create: false }))
                    }
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Nuova Ricetta
                </h2>
                <div>
                    <input
                        type="text"
                        placeholder="Titolo"
                        name="title"
                        value={formDataRecipe.title}
                        onChange={handleInputRecipeChange}
                        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />
                    <textarea
                        placeholder="Descrizione"
                        name="description"
                        value={formDataRecipe.description}
                        onChange={handleInputRecipeChange}
                        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />
                    <input
                        type="number"
                        min={0}
                        placeholder="Tempo di preparazione (minuti)"
                        name="prepTime"
                        value={formDataRecipe.prepTime?.toString()}
                        onChange={handleInputRecipeChange}
                        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />

                    {/* Aggiungi ingredienti */}
                    <AddIngredients
                        ingredients={formDataRecipe.recipeIngredient}
                        onAddIngredient={(newIng) => {
                            setformDataRecipe({
                                ...formDataRecipe,
                                recipeIngredient: [
                                    ...formDataRecipe.recipeIngredient,
                                    newIng,
                                ],
                            });
                        }}
                    ></AddIngredients>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                    >
                        Salva Ricetta
                    </button>
                </div>
            </div>
        </div>
    );
}
