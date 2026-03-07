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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
                    onClick={() =>
                        setShowForm((prev) => ({ ...prev, create: false }))
                    }
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    Nuova Ricetta
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Titolo"
                        name="title"
                        value={formDataRecipe.title}
                        onChange={handleInputRecipeChange}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <textarea
                        placeholder="Descrizione"
                        name="description"
                        value={formDataRecipe.description}
                        onChange={handleInputRecipeChange}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <input
                        type="number"
                        min={0}
                        placeholder="Tempo di preparazione (minuti)"
                        name="prepTime"
                        value={formDataRecipe.prepTime?.toString()}
                        onChange={handleInputRecipeChange}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    />

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-zinc-900 font-medium transition"
                    >
                        Salva Ricetta
                    </button>
                </div>
            </div>
        </div>
    );
}
