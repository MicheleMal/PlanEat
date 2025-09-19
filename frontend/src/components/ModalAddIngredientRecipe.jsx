import { X } from "lucide-react";
import { useState } from "react";

export default function ModalAddIngredientRecipe({
    setShowForm,
    addIngredientRecipe,
    idRecipe,
}) {
    const unit = ["g", "kg", "ml", "l", "pz", "qb"];

    const suggerimentiIngredienti = [
        {
            name: "Pomodoro",
            ingredientId: 17,
        },
        {
            name: "Aglio",
            ingredientId: 13
        }
    ];

    const [formDataIngredient, setFormDataIngredient] = useState({
        name: "",
        quantity: 0,
        unit: "g",
    });

    const [ingredients, setIngrediens] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormDataIngredient({
            ...formDataIngredient,
            [name]: value,
        });
    };

    const addIngredient = () => {
       
                setIngrediens([
                    ...ingredients,
                    {
                        name: formDataIngredient.name,
                        quantity: formDataIngredient.quantity,
                        unit: formDataIngredient.unit,
                    },
                ]);
    

        setFormDataIngredient({
            name: "",
            quantity: 0,
            unit: "g",
        });
    };

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
                    <form className="bg-gray-800 p-3 rounded-lg space-y-2">
                        <h3 className="text-white font-semibold">
                            Ingredienti
                        </h3>
                        <input
                            type="text"
                            placeholder="Ingrediente"
                            name="name"
                            value={formDataIngredient.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                            list="suggerimenti"
                        />
                        <datalist id="suggerimenti">
                            {suggerimentiIngredienti
                                .filter((ing) =>
                                    ing.name
                                        .toLowerCase()
                                        .includes(
                                            formDataIngredient.name.toLowerCase()
                                        )
                                )
                                .map((ing, i) => (
                                    <option key={i} value={ing.name} />
                                ))}
                        </datalist>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Quantità"
                                name="quantity"
                                value={formDataIngredient.quantity}
                                onChange={handleInputChange}
                                className="w-1/3 px-3 py-2 rounded-lg bg-gray-700 text-white"
                            />
                            <select
                                name="unit"
                                value={formDataIngredient.unit}
                                onChange={handleInputChange}
                                className="w-1/3 px-3 py-2 rounded-lg bg-gray-700 text-white"
                            >
                                {unit.map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="w-1/3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white px-3"
                            >
                                Aggiungi
                            </button>
                        </div>

                        <ul className="text-gray-300 list-disc list-inside">
                            {(ingredients || []).map((ing, i) => (
                                <li key={i}>
                                    {ing.name} - {ing.quantity} {ing.unit}
                                </li>
                            ))}
                        </ul>
                    </form>

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
