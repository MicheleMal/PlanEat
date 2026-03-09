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

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormDataMeal({
            ...formDataMeal,
            [name]: value,
        });
    };

    const toggleRecipe = (id) => {
        const exists = formDataMeal.recipes.some((r) => r.id === id);

        if (exists) {
            setFormDataMeal({
                ...formDataMeal,
                recipes: formDataMeal.recipes.filter((r) => r.id !== id),
            });
        } else {
            setFormDataMeal({
                ...formDataMeal,
                recipes: [...formDataMeal.recipes, { id }],
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formDataMeal.date || formDataMeal.recipes.length === 0) return;

        addMeal(formDataMeal);

        setFormDataMeal({
            date: "",
            mealType: mealType[0],
            recipes: [],
        });

        setShowForm((prev) => ({ ...prev, create: false }));
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Close */}
                <button
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
                    onClick={() =>
                        setShowForm((prev) => ({ ...prev, create: false }))
                    }
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    Nuovo Pasto
                </h2>

                <div className="space-y-4">
                    {/* Data */}
                    <input
                        type="date"
                        name="date"
                        value={formDataMeal.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    {/* Tipo pasto */}
                    <select
                        name="mealType"
                        value={formDataMeal.mealType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {mealType.map((mType) => (
                            <option key={mType} value={mType}>
                                {mType}
                            </option>
                        ))}
                    </select>

                    {/* Ricette */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {recipes.map((r) => {
                            const selected = formDataMeal.recipes.some(
                                (recipe) => recipe.id === r.id,
                            );

                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => toggleRecipe(r.id)}
                                    className={`p-2 rounded-lg text-left text-sm transition
                                        ${
                                            selected
                                                ? "bg-emerald-500 text-zinc-900 font-medium"
                                                : "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                        }
                                    `}
                                >
                                    {r.title}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-zinc-900 font-medium transition"
                    >
                        Salva Pasto
                    </button>
                </div>
            </div>
        </div>
    );
}
