import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getRecipes } from "../service/recipes";
import { useAuth } from "../context/AuthContext";

export default function ModalNewMeal({ setShowForm, addMeal }) {
    const { token } = useAuth();
    const mealType = ["Colazione", "Pranzo", "Merenda", "Aperitivo", "Cena"];

    const [recipes, setRecipes] = useState([]);
    const [formDataMeal, setFormDataMeal] = useState({
        date: "",
        mealType: mealType[0],
        recipes: [],
    });

    // Carica le ricette disponibili
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipes(token);
                setRecipes(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecipes();
    }, [token]);

    // Gestione input (data e tipo pasto)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDataMeal((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Aggiungi o rimuovi ricetta dal pasto
    const toggleRecipe = (id) => {
        setFormDataMeal((prev) => {
            const exists = prev.recipes.some((r) => r.id === id);
            return {
                ...prev,
                recipes: exists
                    ? prev.recipes.filter((r) => r.id !== id)
                    : [...prev.recipes, { id }],
            };
        });
    };

    const handleSubmit = () => {
        if (!formDataMeal.date || formDataMeal.recipes.length === 0) return;

        addMeal(formDataMeal);

        // Reset
        setFormDataMeal({
            date: "",
            mealType: mealType[0],
            recipes: [],
        });

        setShowForm((prev) => ({ ...prev, create: false }));
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl relative shadow-xl overflow-y-auto max-h-[90vh]">
                {/* Close button */}
                <button
                    onClick={() =>
                        setShowForm((prev) => ({ ...prev, create: false }))
                    }
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    Nuovo Pasto
                </h2>

                {/* Data */}
                <input
                    type="date"
                    name="date"
                    value={formDataMeal.date}
                    onChange={handleInputChange}
                    className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Tipo pasto */}
                <select
                    name="mealType"
                    value={formDataMeal.mealType}
                    onChange={handleInputChange}
                    className="w-1/3 mb-4 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {mealType.map((mType) => (
                        <option key={mType} value={mType}>
                            {mType}
                        </option>
                    ))}
                </select>

                {/* Griglia ricette */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto mb-4">
                    {recipes.map((r) => {
                        const selected = formDataMeal.recipes.some(
                            (recipe) => recipe.id === r.id,
                        );
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => toggleRecipe(r.id)}
                                className={`p-2 rounded text-left transition-all duration-150 ${
                                    selected
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                {r.title}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                >
                    Salva Pasto
                </button>
            </div>
        </div>
    );
}
