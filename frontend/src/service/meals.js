import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const url = `${apiUrl}/`;

export const getMeals = async (token) => {
    const { data } = await axios.get(`${url}meals`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const createMeal = async (token, newMeal) => {
    const { data } = await axios.post(`${url}meals`, newMeal, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

/*export const updateMeal = async(meal, id, token) => {
    const {data} = await axios.patch(`${url}meals`, )
}*/

export const deleteMeal = async (id, token) => {
    const { data } = await axios.delete(`${url}meals/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
