import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL

const url = `${apiUrl}/auth/`;

export const signin = async (user) => {
    const { data } = await axios.post(`${url}signin`, {
        email: user.email.trim(),
        password: user.password,
    });

    return data;
};

export const signup = async (user) => {
    const { data } = await axios.post(`${url}signup`, {
        name: user.name.trim(),
        email: user.email.trim(),
        password: user.password,
    });

    return data;
};
