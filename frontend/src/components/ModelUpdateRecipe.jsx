import { X } from "lucide-react";
import { useState } from "react";

export default function ModalUpdateRecipe({
    setShowForm,
    recipe,
    onUpdate,
    removeIngredientRecipe,
}) {
    const [editing, setEditing] = useState(false);
    const [formUpdatedRecipe, setFormUpdatedRecipe] = useState(recipe);

    const handleInputChange = (e, i, nameInput) => {
        const { name, value } = e.target;
        if (i === undefined) {
            setFormUpdatedRecipe({
                ...formUpdatedRecipe,
                [name]: value,
            });
            return;
        }

        setFormUpdatedRecipe(() => {
            const updatedRecipeIngredient = [
                ...formUpdatedRecipe.recipeIngredient,
            ];

            if (nameInput == "quantity") {
                updatedRecipeIngredient[i] = {
                    ...updatedRecipeIngredient[i],
                    quantity: Number(value),
                };
            } else if (nameInput == "unit") {
                updatedRecipeIngredient[i] = {
                    ...updatedRecipeIngredient[i],
                    unit: value,
                };
            }

            return {
                ...formUpdatedRecipe,
                recipeIngredient: updatedRecipeIngredient,
            };
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl relative shadow-lg overflow-y-auto max-h-[90vh]">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-white">
                    <X
                        className="h-6 w-6"
                        onClick={() =>
                            setShowForm((prev) => ({ ...prev, editing: false }))
                        }
                    />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Modifica Ricetta
                </h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Titolo"
                        value={formUpdatedRecipe.title}
                        onChange={handleInputChange}
                        name="title"
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />
                    <textarea
                        placeholder="Descrizione"
                        name="description"
                        value={formUpdatedRecipe.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />
                    <input
                        type="number"
                        min={0}
                        placeholder="Tempo di preparazione (minuti)"
                        name="prepTime"
                        value={formUpdatedRecipe.prepTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />

                    {/* Modifica ingredienti */}
                    <form className="bg-gray-800 p-3 rounded-lg space-y-2">
                        <h3 className="text-white font-semibold">
                            Ingredienti
                        </h3>

                        <ul className="text-gray-300 list-disc list-inside">
                            {recipe.recipeIngredient.map((ing, i) => (
                                <li
                                    key={i}
                                    className={
                                        editing === i
                                            ? "list-none"
                                            : "list-disc list-inside"
                                    }
                                >
                                    {editing === i ? (
                                        <div className="flex gap-2 items-center">
                                            <span
                                                onClick={() => setEditing(i)}
                                                className={
                                                    editing === i
                                                        ? "cursor-text"
                                                        : "cursor-pointer"
                                                }
                                            >
                                                {ing.ingredient?.name}{" "}
                                            </span>
                                            {/* Quantità */}
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={
                                                    formUpdatedRecipe
                                                        .recipeIngredient[i]
                                                        .quantity
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        i,
                                                        "quantity"
                                                    )
                                                }
                                                className="px-2 py-1 rounded bg-gray-700 text-white w-20"
                                            />

                                            {/* Unità */}
                                            <input
                                                type="text"
                                                value={
                                                    formUpdatedRecipe
                                                        .recipeIngredient[i]
                                                        .unit
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        i,
                                                        "unit"
                                                    )
                                                }
                                                name="unit"
                                                className="px-2 py-1 rounded bg-gray-700 text-white w-20"
                                            />

                                            {/* Button per uscire dalla modalità editing */}
                                            <button
                                                onClick={() =>
                                                    setEditing(false)
                                                }
                                                className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-white"
                                            >
                                                ✔
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span
                                                onClick={() => setEditing(i)}
                                                className="cursor-pointer"
                                            >
                                                {ing.ingredient?.name} -{" "}
                                                {
                                                    formUpdatedRecipe
                                                        .recipeIngredient[i]
                                                        .quantity
                                                }{" "}
                                                {
                                                    formUpdatedRecipe
                                                        .recipeIngredient[i]
                                                        .unit
                                                }
                                            </span>
                                            {/* X per eliminare */}
                                            <button
                                                className="ml-3 px-2 bg-red-600 hover:bg-red-500 rounded text-white"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeIngredientRecipe(
                                                        recipe.id,
                                                        ing.ingredientId,
                                                        true
                                                    );
                                                }}
                                            >
                                                ✖
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </form>

                    <button
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                        onClick={() => onUpdate(formUpdatedRecipe, recipe.id)}
                    >
                        Modifica Ricetta
                    </button>
                    <button
                        className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-500 rounded-lg text-white"
                        onClick={() =>
                            setShowForm((prev) => ({ ...prev, editing: false, addIngredient: true}))
                        }
                    >
                        Nuovo Ingrediente
                    </button>
                </div>
            </div>
        </div>
    );
}
