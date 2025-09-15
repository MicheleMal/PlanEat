import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import ModalNewRecipe from "../components/ModalNewRecipe";
import type { Recipe } from "../types/recipe";
import ModalRecipe from "../components/ModalRecipe";
import { createRecipe, getRecipes } from "../services/recipes";

export default function Recipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const [selected, setSelected] = useState<Recipe | null>(null);
    const [showForm, setShowForm] = useState(false);

    const addRecipe = async (newRecipe: Recipe) => {
        try {
            const recipe = await createRecipe(newRecipe)
            setRecipes([...recipes, recipe])
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipes();
                setRecipes(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRecipes();
    }, [recipes]);

    return (
        <>
            <Navbar />
            <div className="bg-gray-950 min-h-screen text-gray-300 p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Ricette</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
                    >
                        <Plus className="h-5 w-5" /> Nuova Ricetta
                    </button>
                </div>

                {/* Lista Ricette */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            onClick={() => setSelected(recipe)}
                            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl cursor-pointer shadow-md"
                        >
                            <h2 className="text-lg font-semibold text-white">
                                {recipe.title}
                            </h2>
                        </div>
                    ))}
                </div>

                {/*Modale dettagli ricetta */}
                {selected && (
                    <ModalRecipe
                        selected={selected}
                        setSelected={setSelected}
                    ></ModalRecipe>
                )}

                {/* Modale nuova ricetta */}
                {showForm && (
                    <ModalNewRecipe
                        setShowForm={setShowForm}
                        addRecipe={addRecipe}
                    ></ModalNewRecipe>
                )}
            </div>
        </>
    );
}
