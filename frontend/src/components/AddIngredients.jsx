import { useState } from "react";
import { searchIngredient } from "../service/recipes";

export default function AddIngredients({ ingredients, onAddIngredient }) {
    const unit = ["g", "kg", "ml", "l", "pz", "qb"];
    const [listIngredient, setListIngredient] = useState([]);

    const [formDataIngredient, setFormDataIngredient] = useState({
        name: "",
        quantity: 0,
        unit: "g",
    });

    const handelInputIngredientsChange = async (e) => {
        const { name, value } = e.target;

        if (name === "name" && value.length >= 1) {
            const data = await searchIngredient(value);

            setListIngredient(data || []);
        }

        setFormDataIngredient({
            ...formDataIngredient,
            [name]: value,
        });
    };

    const handleSubmitIngredient = (e) => {
        e.preventDefault();

        if (!formDataIngredient.name.trim()) return;

        onAddIngredient(formDataIngredient);

        setFormDataIngredient({
            name: "",
            quantity: 0,
            unit: "g",
        });
    };

    return (
        <>
            <div className="bg-gray-800 p-3 rounded-lg space-y-2">
                <h3 className="text-white font-semibold">Ingredienti</h3>
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
                    {listIngredient
                        .filter((ing) =>
                            ing.name
                                .toLowerCase()
                                .includes(formDataIngredient.name.toLowerCase())
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
                    {ingredients.length > 0 &&
                        ingredients.map((ing, i) => (
                            <li key={i}>
                                {ing.name} - {ing.quantity} {ing.unit}
                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
}
