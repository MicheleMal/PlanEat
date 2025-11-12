import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Plus } from "lucide-react";
import ModalNewMeal from "../components/ModalNewMeal";
import { createMeal, deleteMeal, getMeals } from "../service/meals";
import { useAuth } from "../context/AuthContext";
import { getRecipesById } from "../service/recipes";
import ModalRecipe from "../components/ModalRecipe";

const mealColors = {
    Colazione: "bg-yellow-600",
    Pranzo: "bg-green-600",
    Merenda: "bg-purple-600",
    Aperitivo: "bg-red-600",
    Cena: "bg-blue-600",
};

export default function Meals() {
    const { token } = useAuth();
    const [showForm, setShowForm] = useState({
        create: false,
    });

    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const data = await getMeals(token);
                setMeals(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, []);

    const addMeal = async (newMeal) => {
        try {
            await createMeal(token, newMeal);
            const meals = await getMeals(token);
            setMeals(meals);
        } catch (error) {
            console.error(error);
        }
    };

    const getRecipe = async (id) => {
        try {
            const data = await getRecipesById(token, id);

            console.log(data);

            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const onDeleteMeal = async (id) => {
        try {
            await deleteMeal(id, token);

            const newMeals = meals.filter((meal) => meal.id !== id);

            setMeals(newMeals);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-950 min-h-screen text-gray-300 p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Pasti</h1>
                    <button
                        onClick={() =>
                            setShowForm({ ...showForm, create: true })
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg text-white"
                    >
                        <Plus className="h-5 w-5" /> Nuovo Pasto
                    </button>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                        <p className="text-white text-lg">
                            Caricamento pasti...
                        </p>
                    </div>
                ) : (
                    // Lista pasti
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {meals.map((meal) => (
                            <div key={meal.id}>
                                <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
                                    {new Date(meal.date).toLocaleDateString(
                                        "it-IT",
                                        {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                        }
                                    )}
                                </h2>
                                <div className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700 hover:border-gray-600 transition">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span
                                                className={`${
                                                    mealColors[meal.mealType]
                                                } text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3`}
                                            >
                                                {meal.mealType.toUpperCase()}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {meal.mealRecipe.map((r) => {
                                                    const recipe = getRecipe(
                                                        r.id
                                                    );
                                                    return recipe ? (
                                                        <button
                                                            key={r.id}
                                                            //onClick={() => setSelected(recipe)}
                                                            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm text-left"
                                                        >
                                                            {r.recipe.title}
                                                        </button>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-gray-400 text-sm">
                                                {new Date(
                                                    meal.date
                                                ).toLocaleDateString("it-IT")}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    //onClick={() => openEdit(meal)}
                                                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-white text-sm"
                                                >
                                                    Modifica
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onDeleteMeal(meal.id)
                                                    }
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-sm"
                                                >
                                                    Elimina
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modale nuova ricetta */}
                {showForm.create === true && (
                    <ModalNewMeal
                        setShowForm={setShowForm}
                        addMeal={addMeal}
                    ></ModalNewMeal>
                )}
            </div>
        </>
    );
}
