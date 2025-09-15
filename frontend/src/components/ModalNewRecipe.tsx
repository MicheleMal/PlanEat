import { X } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "../types/recipe";
import type { Ingredient } from "../types/ingredient";

interface ModelNewRecipeProps {
    setShowForm: (value: boolean) => void;
    addRecipe: (value: Recipe) => void;
}

export default function ModelNewRecipe({
    setShowForm,
    addRecipe,
}: ModelNewRecipeProps) {
    const unit = ["g", "kg", "ml", "l", "pz", "qb"];

    const suggerimentiIngredienti = [
        "Pomodoro",
        "Pomodori secchi",
        "Cipolla",
        "Aglio",
        "Olio d'oliva",
        "Sale",
        "Pepe",
        "Basilico",
        "Pasta",
        "Mozzarella",
    ];

    const [formDataRecipe, setformDataRecipe] = useState<Recipe>({
        title: "",
        description: "",
        prepTime: 0,
        recipeIngredient: [] as Ingredient[],
    });

    const [formDataIngredient, setFormDataIngredient] = useState({
        name: "",
        quantity: 0,
        unit: "g",
    });

    const handleInputRecipeChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setformDataRecipe({
            ...formDataRecipe,
            [name]: value,
        });
    };

    const handelInputIngredientsChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormDataIngredient({
            ...formDataIngredient,
            [name]: value,
        });
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        addRecipe(formDataRecipe);
        setformDataRecipe({
            title: "",
            description: "",
            prepTime: 0,
            recipeIngredient: [],
        });
    };

    const handleSubmitIngredient = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!formDataIngredient.name.trim()) return;

        setformDataRecipe({
            ...formDataRecipe,
            recipeIngredient: [
                ...formDataRecipe.recipeIngredient,
                formDataIngredient,
            ],
        });

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
                    onClick={() => setShowForm(false)}
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Nuova Ricetta
                </h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Titolo"
                        name="title"
                        value={formDataRecipe.title}
                        onChange={handleInputRecipeChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />
                    <textarea
                        placeholder="Descrizione"
                        name="description"
                        value={formDataRecipe.description}
                        onChange={handleInputRecipeChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />
                    <input
                        type="number"
                        min={0}
                        placeholder="Tempo di preparazione (minuti)"
                        name="prepTime"
                        value={formDataRecipe.prepTime}
                        onChange={handleInputRecipeChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />

                    {/* Aggiungi ingredienti */}
                    <form
                        className="bg-gray-800 p-3 rounded-lg space-y-2"
                        onSubmit={handleSubmitIngredient}
                    >
                        <h3 className="text-white font-semibold">
                            Ingredienti
                        </h3>
                        <input
                            type="text"
                            placeholder="Ingrediente"
                            name="name"
                            value={formDataIngredient.name}
                            onChange={handelInputIngredientsChange}
                            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                            list="suggerimenti"
                        />
                        <datalist id="suggerimenti">
                            {suggerimentiIngredienti
                                .filter((ing) =>
                                    ing
                                        .toLowerCase()
                                        .includes(
                                            formDataIngredient.name.toLowerCase()
                                        )
                                )
                                .map((ing, i) => (
                                    <option key={i} value={ing} />
                                ))}
                        </datalist>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Quantità"
                                name="quantity"
                                value={formDataIngredient.quantity}
                                onChange={handelInputIngredientsChange}
                                className="w-1/3 px-3 py-2 rounded-lg bg-gray-700 text-white"
                            />
                            <select
                                name="unit"
                                value={formDataIngredient.unit}
                                onChange={handelInputIngredientsChange}
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
                                onClick={handleSubmitIngredient}
                                className="w-1/3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white px-3"
                            >
                                Aggiungi
                            </button>
                        </div>

                        <ul className="text-gray-300 list-disc list-inside">
                            {(formDataRecipe.recipeIngredient || []).map(
                                (ing, i) => (
                                    <li key={i}>
                                        {ing.name} - {ing.quantity} {ing.unit}
                                    </li>
                                )
                            )}
                        </ul>
                    </form>

                    <button
                        onClick={handleSubmit}
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                    >
                        Salva Ricetta
                    </button>
                </div>
            </div>
        </div>
    );
}
