import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL

const url = `${apiUrl}/users/me`;

export const getProfile = async (token) => {
    const { data } = await axios.get(`${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const updateProfile = async (updatedUser, token) => {
    const { data } = await axios.patch(`${url}`, updatedUser, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data
};

export const deleteProfile = async (token) => {
    const { data } = await axios.delete(`${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data
};
