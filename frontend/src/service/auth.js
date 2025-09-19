import axios from "axios";

const url = "http://127.0.0.1:3000/auth/";

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
