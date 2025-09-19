import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { deleteProfile, getProfile, updateProfile } from "../service/user";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await getProfile();
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        getUser();
    }, []);

    const handleSubmit = async () => {
        try {
            const data = await updateProfile(user);

            setUser(data);
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteProfile = async () => {
        try {
            await deleteProfile(user);

            navigate("/")
            localStorage.clear()
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl relative shadow-lg overflow-y-auto max-h-[90vh]">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Ciao {user ? user.name : ""}
                    </h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={user ? user.name : ""}
                            onChange={(e) => {
                                setUser({ ...user, name: e.target.value });
                            }}
                            className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 text-white"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={user ? user.password : ""}
                            onChange={(e) => {
                                setUser({ ...user, password: e.target.value });
                            }}
                            className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-800 text-white"
                        />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white"
                        >
                            Modifica
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.clear();
                                navigate("/");
                            }}
                            className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
                        >
                            Logout
                        </button>
                        <button
                            type="button"
                            onClick={onDeleteProfile}
                            className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
                        >
                            ELimina Profilo
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
