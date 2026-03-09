import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Plus } from "lucide-react";
import ModalNewMeal from "../components/ModalNewMeal";
import ModalUpdateMeal from "../components/ModalUpdateMeal";
import { createMeal, deleteMeal, getMeals, updateMeal } from "../service/meals";
import { useAuth } from "../context/AuthContext";
import DayCard from "../components/DayCard";
import { useNotification } from "../context/NotificationContext.jsx";

export default function Meals() {
    const { notify } = useNotification();

    const { token } = useAuth();

    const [showForm, setShowForm] = useState({
        create: false,
        editing: false,
    });

    const [meals, setMeals] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const data = await getMeals(token);
                setMeals(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, [token]);

    const addMeal = async (newMeal) => {
        try {
            await createMeal(token, newMeal);
            const updatedMeals = await getMeals(token);
            setMeals(updatedMeals);

            notify("Pasto aggiunto con successo", "success");
        } catch (error) {
            console.error(error);
        }
    };

    const onUpdateMeal = async (updatedMeal, id) => {
        try {
            await updateMeal(updatedMeal, id, token);

            const updatedMeals = meals.map((meal) =>
                meal.id === id ? { ...meal, ...updatedMeal } : meal,
            );

            setMeals(updatedMeals);

            setShowForm((prev) => ({ ...prev, editing: false }));
            setSelectedMeal(null);

            notify("Pasto modificato con successo", "success");
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteMeal = async (id) => {
        try {
            await deleteMeal(id, token);

            const newMeals = meals.filter((meal) => meal.id !== id);
            setMeals(newMeals);

            notify("Pasto eliminato con successo", "success");
        } catch (error) {
            console.error(error);
        }
    };

    /* apertura modal modifica */
    const openEditMeal = (meal) => {
        setSelectedMeal(meal);
        setShowForm((prev) => ({ ...prev, editing: true }));
    };

    /* raggruppa pasti per data */
    const groupedMeals = meals.reduce((acc, meal) => {
        const date = meal.date;

        if (!acc[date]) acc[date] = [];

        acc[date].push(meal);

        return acc;
    }, {});

    return (
        <>
            <Navbar />

            <div className="bg-black min-h-screen text-white p-10">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">
                            Pasti Pianificati
                        </h1>

                        <button
                            onClick={() =>
                                setShowForm((prev) => ({
                                    ...prev,
                                    create: true,
                                }))
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-zinc-900 font-medium"
                        >
                            <Plus className="h-5 w-5" />
                            Nuovo Pasto
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                            <p className="text-white text-lg">
                                Caricamento pasti...
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(groupedMeals).map(
                                ([date, meals]) => (
                                    <DayCard
                                        key={date}
                                        date={date}
                                        meals={meals}
                                        onEdit={openEditMeal}
                                        onDelete={onDeleteMeal}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>

                {showForm.create && (
                    <ModalNewMeal setShowForm={setShowForm} addMeal={addMeal} />
                )}

                {showForm.editing && selectedMeal && (
                    <ModalUpdateMeal
                        setShowForm={setShowForm}
                        meal={selectedMeal}
                        onUpdate={onUpdateMeal}
                    />
                )}
            </div>
        </>
    );
}
