import { RecycleIcon, X } from "lucide-react";
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
        const getData = async () => {
            try {
                const data = await getRecipes(token);
                setRecipes(data);
            } catch (error) {
                console.error(error);
            }
        };

        getData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormDataMeal({
            ...formDataMeal,
            [name]: value,
        });
    };

    const toggleRecipe = (id, selected) => {
        setFormDataMeal((prev) => ({
            ...prev,
            recipes: selected
                ? prev.recipes.filter((recipe) => recipe.id !== id)
                : [...prev.recipes, { id: id }],
        }));
    };

    const handleSubmit = ()=>{
        addMeal(formDataMeal)
        setFormDataMeal({
            date: "",
            mealType: mealType[0],
            recipes: []
        })

        setShowForm((prev)=> ({...prev, create: false}))
    }   

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl relative shadow-lg overflow-y-auto max-h-[90vh]">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white hover:cursor-pointer"
                    onClick={() =>
                        setShowForm((prev) => ({ ...prev, create: false }))
                    }
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Nuovo Pasto
                </h2>
                <div>
                    <input
                        type="date"
                        placeholder="Data"
                        name="date"
                        value={formDataMeal.date}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 text-white"
                    />

                    <div className="flex gap-2">
                        <select
                            name="mealType"
                            value={formDataMeal.mealType}
                            onChange={handleInputChange}
                            className="w-1/3 px-3 py-2 rounded-lg bg-gray-700 text-white"
                        >
                            {mealType.map((mType) => (
                                <option key={mType} value={mType}>
                                    {mType}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto mb-4 mt-4">
                        {recipes.map((r) => {
                            const selected = formDataMeal.recipes.some(
                                (recipe) => recipe.id === r.id
                            );
                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => toggleRecipe(r.id, selected)}
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
                        className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer rounded-lg text-white"
                    >
                        Salva Pasto
                    </button>
                </div>
            </div>
        </div>
    );
}
