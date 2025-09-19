import axios from "axios";

const url = "http://127.0.0.1:3000/users/me";
const token = localStorage.getItem("token");

export const getProfile = async () => {
    const { data } = await axios.get(`${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const updateProfile = async (updatedUser) => {
    const { data } = await axios.patch(`${url}`, updatedUser, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data
};

export const deleteProfile = async () => {
    const { data } = await axios.delete(`${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data
};
