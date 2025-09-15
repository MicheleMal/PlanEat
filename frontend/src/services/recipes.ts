import axios from "axios";
import type { Recipe } from "../types/recipe";

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoicHJvdmFAZ21haWwuY29tIiwiaWF0IjoxNzU2ODI5MjAzfQ.jDDJplGZ96LSs3E2fA0_yZyUUGuOml97rLJiLMKafKM";

export const getRecipes = async (): Promise<Recipe[]> => {
    const { data } = await axios.get("http://127.0.0.1:3000/recipes", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const createRecipe = async (newRecipe: Recipe): Promise<Recipe> => {
    newRecipe.prepTime = Number(newRecipe.prepTime);
    newRecipe.recipeIngredient.map((ing) => {
        ing.quantity = Number(ing.quantity);
    });

    const payload = {
        ...newRecipe,
        ingredients: newRecipe.recipeIngredient,
    };
    const { data } = await axios.post(
        "http://127.0.0.1:3000/recipes",
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return data;
};
