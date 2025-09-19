import axios from "axios";

const token = localStorage.getItem("token");

const url = "http://127.0.0.1:3000/";

export const getRecipes = async () => {
    const { data } = await axios.get(`${url}recipes`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const createRecipe = async (newRecipe) => {
    newRecipe.prepTime = Number(newRecipe.prepTime);
    newRecipe.recipeIngredient.map((ing) => {
        ing.quantity = Number(ing.quantity);
    });

    const payload = {
        ...newRecipe,
        ingredients: newRecipe.recipeIngredient,
    };
    const { data } = await axios.post(`${url}recipes`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const updateRecipe = async (recipe, id) => {
    if (recipe.prepTime) {
        recipe.prepTime = Number(recipe.prepTime);
    } else if (recipe.recipeIngredient) {
        recipe.recipeIngredient.map((ing) => {
            ing.quantity = Number(ing.quantity);
        });
    }

    const { data } = await axios.patch(`${url}recipes/${id}`, recipe, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const deleteRecipe = async (id) => {
    await axios.delete(`${url}recipes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return true;
};

export const searchIngredient = async (name) => {
    const { data } = await axios.get(`${url}ingredients`, {
        params: {
            search: name,
        },
    });

    return data;
};
