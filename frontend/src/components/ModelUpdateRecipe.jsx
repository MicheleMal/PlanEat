import { X } from "lucide-react";
import { useState } from "react";

export default function ModalUpdateRecipe({
    setShowForm,
    recipe,
    onUpdate,
    removeIngredientRecipe,
}) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [formUpdatedRecipe, setFormUpdatedRecipe] = useState(recipe);

    const handleInputChange = (e, index, field) => {
        const { name, value } = e.target;

        if (index === undefined) {
            setFormUpdatedRecipe((prev) => ({
                ...prev,
                [name]: value,
            }));
            return;
        }

        setFormUpdatedRecipe((prev) => {
            const updatedIngredients = [...prev.recipeIngredient];

            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [field]: field === "quantity" ? Number(value) : value,
            };

            return {
                ...prev,
                recipeIngredient: updatedIngredients,
            };
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl relative shadow-xl overflow-y-auto max-h-[90vh]">
                {/* Close button */}
                <button
                    onClick={() =>
                        setShowForm((prev) => ({ ...prev, editing: false }))
                    }
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    Modifica Ricetta
                </h2>

                <div className="space-y-4">
                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Titolo"
                        name="title"
                        value={formUpdatedRecipe.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Descrizione"
                        name="description"
                        value={formUpdatedRecipe.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Prep time */}
                    <input
                        type="number"
                        min={0}
                        placeholder="Tempo di preparazione (minuti)"
                        name="prepTime"
                        value={formUpdatedRecipe.prepTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Ingredienti */}
                    <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                        <h3 className="text-white font-semibold">
                            Ingredienti
                        </h3>

                        <ul className="space-y-2 text-gray-300">
                            {formUpdatedRecipe.recipeIngredient.map(
                                (ing, i) => (
                                    <li key={i}>
                                        {editingIndex === i ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">
                                                    {ing.ingredient?.name}
                                                </span>

                                                <input
                                                    type="number"
                                                    value={ing.quantity}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            i,
                                                            "quantity",
                                                        )
                                                    }
                                                    className="px-2 py-1 rounded bg-gray-700 text-white w-20"
                                                />

                                                <input
                                                    type="text"
                                                    value={ing.unit}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            i,
                                                            "unit",
                                                        )
                                                    }
                                                    className="px-2 py-1 rounded bg-gray-700 text-white w-20"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditingIndex(null)
                                                    }
                                                    className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-white"
                                                >
                                                    ✔
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <span
                                                    onClick={() =>
                                                        setEditingIndex(i)
                                                    }
                                                    className="cursor-pointer hover:text-white"
                                                >
                                                    {ing.ingredient?.name} —{" "}
                                                    {ing.quantity} {ing.unit}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="px-2 bg-red-600 hover:bg-red-500 rounded text-white"
                                                    onClick={() =>
                                                        removeIngredientRecipe(
                                                            recipe.id,
                                                            ing.ingredientId,
                                                            true,
                                                        )
                                                    }
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>

                    {/* Buttons */}
                    <button
                        type="button"
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                        onClick={() => onUpdate(formUpdatedRecipe, recipe.id)}
                    >
                        Modifica Ricetta
                    </button>

                    <button
                        type="button"
                        className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-lg text-white"
                        onClick={() =>
                            setShowForm((prev) => ({
                                ...prev,
                                editing: false,
                                addIngredient: true,
                            }))
                        }
                    >
                        Nuovo Ingrediente
                    </button>
                </div>
            </div>
        </div>
    );
}
