import { useState } from "react";
import { searchIngredient } from "../service/recipes";

export default function AddIngredients({ ingredients, onAddIngredient }) {
    const units = ["g", "kg", "ml", "l", "pz", "qb"];
    const [suggestions, setSuggestions] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        quantity: 0,
        unit: "g",
    });

    // Gestione input
    const handleInputChange = async (e) => {
        const { name, value } = e.target;

        if (name === "name" && value.length > 0) {
            try {
                const data = await searchIngredient(value);
                setSuggestions(data || []);
            } catch (err) {
                setSuggestions([]);
            }
        } else if (name === "name") {
            setSuggestions([]);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Aggiungi ingrediente
    const handleAddIngredient = () => {
        if (!formData.name.trim()) return;

        onAddIngredient(formData);

        setFormData({
            name: "",
            quantity: 0,
            unit: "g",
        });
        setSuggestions([]);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-3">
            <h3 className="text-white font-semibold">Ingredienti</h3>

            <input
                type="text"
                name="name"
                placeholder="Ingrediente"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                list="ingredient-suggestions"
            />

            <datalist id="ingredient-suggestions">
                {suggestions
                    .filter((ing) =>
                        ing.name
                            .toLowerCase()
                            .includes(formData.name.toLowerCase()),
                    )
                    .map((ing) => (
                        <option key={ing.id || ing.name} value={ing.name} />
                    ))}
            </datalist>

            <div className="flex gap-2">
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantità"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-1/3 px-3 py-2 rounded-lg bg-gray-700 text-white"
                />
                <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-1/3 px-3 py-2 rounded-lg bg-gray-700 text-white"
                >
                    {units.map((u) => (
                        <option key={u} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="w-1/3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white px-3 py-2 transition-colors"
                >
                    Aggiungi
                </button>
            </div>

            <ul className="text-gray-300 list-disc list-inside">
                {ingredients.length > 0 &&
                    ingredients.map((ing, i) => (
                        <li key={ing.ingredientId || i}>
                            {ing.name} - {ing.quantity} {ing.unit}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
