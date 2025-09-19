import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import ModalNewRecipe from "../components/ModalNewRecipe";
import ModalRecipe from "../components/ModalRecipe";
import {
    createRecipe,
    deleteRecipe,
    getRecipes,
    updateRecipe,
} from "../service/recipes.js";
import ModalUpdateRecipe from "../components/ModelUpdateRecipe.jsx";
import ModalAddIngredientRecipe from "../components/ModalAddIngredientRecipe.jsx";

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);

    // Selezione modal recipe
    const [selected, setSelected] = useState(null);

    // Aprire e chiudere form per creare o modificare la ricetta
    const [showForm, setShowForm] = useState({
        editing: false,
        create: false,
        addIngredient: false,
    });
    // Caricamento
    const [loading, setLoading] = useState(true);

    //? Eliminare dopo il fix del backend, getRecipes
    // Inserire nuova ricetta
    const addRecipe = async (newRecipe) => {
        try {
            await createRecipe(newRecipe);
            const recipes = await getRecipes();
            setRecipes(recipes);
        } catch (error) {
            console.error(error);
        }
    };

    // Modifica ricetta
    const onUpdateRecipe = async (updatedRecipe, id) => {
        const updatedRecipeObject = {};

        const originalRecipe = recipes.find((r) => r.id === id);

        // 1 caso: Modifica title e/o description e/o prepTime
        if (originalRecipe.title !== updatedRecipe.title) {
            updatedRecipeObject.title = updatedRecipe.title.trim();
        }
        if (originalRecipe.description !== updatedRecipe.description) {
            updatedRecipeObject.description = updatedRecipe.description.trim();
        }
        if (originalRecipe.prepTime !== updatedRecipe.prepTime) {
            updatedRecipeObject.prepTime = updatedRecipe.prepTime.trim();
        }

        // 2 caso: modifica unità e quantità degli ingredienti
        const updatedIngredient = [];
        originalRecipe.recipeIngredient.forEach((ing) => {
            const uRecipe = updatedRecipe.recipeIngredient.find(
                (u) => u.ingredientId === ing.ingredientId
            );

            if (uRecipe) {
                const changes = {};

                if (ing.quantity !== uRecipe.quantity) {
                    changes.ingredientId = uRecipe.ingredientId;
                    changes.quantity = uRecipe.quantity;
                }
                if (ing.unit !== uRecipe.unit) {
                    changes.ingredientId = uRecipe.ingredientId;
                    changes.unit = uRecipe.unit;
                }

                if (Object.keys(changes).length > 0) {
                    updatedIngredient.push(changes);
                }
            }
        });
        updatedRecipeObject.ingredients = updatedIngredient;

        setShowForm({ ...showForm, editing: false });
        setSelected(false);

        try {
            await updateRecipe(updatedRecipeObject, id);
            setRecipes(await getRecipes());
        } catch (error) {
            console.error(error);
        }
    };

    // 3 caso: Eliminare ingrediete associato alla ricetta
    const removeIngredientRecipe = async (
        id,
        ingredientId,
        deleteIngredient
    ) => {
        const deletedIngredientRecipe = {
            ingredients: [],
        };

        deletedIngredientRecipe.ingredients.push({
            ingredientId: ingredientId,
            delete: deleteIngredient,
        });

        setShowForm({ ...showForm, editing: false });
        setSelected(false);
        try {
            await updateRecipe(deletedIngredientRecipe, id);
            setRecipes(await getRecipes());
        } catch (error) {
            console.error(error);
        }
    };

    // 4 caso: Aggiungere nuovo/i ingrediente/i alla ricetta
    const addIngredientRecipe = async (ingredients) => {
        const ingredientRecipe = {
            ingredients: [],
        };

        ingredients.forEach((ing) => {
            ingredientRecipe.ingredients.push({
                name: ing.name,
                quantity: Number(ing.quantity),
                unit: ing.unit,
            });
        });

        setShowForm({ ...showForm, addIngredient: false });
        setSelected(false);

        try {
            await updateRecipe(ingredientRecipe, selected.id);
            setRecipes(await getRecipes());
        } catch (error) {
            console.error(error);
        }
    };

    // Elimina ricetta
    const onDeleteRecipe = async (id) => {
        try {
            await deleteRecipe(id);

            const newRecipes = recipes.filter((recipe) => recipe.id !== id);

            setRecipes(newRecipes);
            setSelected(null);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipes();
                setRecipes(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <>
            <Navbar />
            <div className="bg-gray-950 min-h-screen text-gray-300 p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Ricette</h1>
                    <button
                        onClick={() =>
                            setShowForm({ ...showForm, create: true })
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
                    >
                        <Plus className="h-5 w-5" /> Nuova Ricetta
                    </button>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                        <p className="text-white text-lg">
                            Caricamento ricette...
                        </p>
                    </div>
                ) : (
                    // Lista ricette
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
                )}

                {/*Modale dettagli ricetta */}
                {selected && (
                    <ModalRecipe
                        selected={selected}
                        setSelected={setSelected}
                        setShowForm={setShowForm}
                        onDelete={onDeleteRecipe}
                    ></ModalRecipe>
                )}

                {/* Modale nuova ricetta */}
                {showForm.create === true && (
                    <ModalNewRecipe
                        setShowForm={setShowForm}
                        addRecipe={addRecipe}
                    ></ModalNewRecipe>
                )}

                {/* Modale modifica ricetta */}
                {showForm.editing === true && (
                    <ModalUpdateRecipe
                        setShowForm={setShowForm}
                        recipe={selected}
                        onUpdate={onUpdateRecipe}
                        removeIngredientRecipe={removeIngredientRecipe}
                    ></ModalUpdateRecipe>
                )}

                {/* Modale inserire nuovo ingrediente alla ricetta */}
                {showForm.addIngredient === true && (
                    <ModalAddIngredientRecipe
                        setShowForm={setShowForm}
                        addIngredientRecipe={addIngredientRecipe}
                    ></ModalAddIngredientRecipe>
                )}
            </div>
        </>
    );
}
