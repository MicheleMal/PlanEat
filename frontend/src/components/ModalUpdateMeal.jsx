import { X } from "lucide-react";
import { useState } from "react";

export default function ModalUpdateMeal({ setShowForm, meal, onUpdate }) {

    const mealType = ["Colazione", "Pranzo", "Merenda", "Aperitivo", "Cena"];

    const [formUpdatedMeal, setFormUpdatedMeal] = useState({
        date: meal.date,
        mealType: meal.mealType,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormUpdatedMeal((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-xl relative shadow-2xl">

                <button
                    onClick={() =>
                        setShowForm((prev) => ({ ...prev, editing: false }))
                    }
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    Modifica Pasto
                </h2>

                <div className="space-y-4">

                    <input
                        type="date"
                        name="date"
                        value={formUpdatedMeal.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-emerald-500"
                    />

                    <select
                        name="mealType"
                        value={formUpdatedMeal.mealType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-emerald-500"
                    >
                        {mealType.map((mType) => (
                            <option key={mType} value={mType}>
                                {mType}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-zinc-900 font-medium"
                        onClick={() => onUpdate(formUpdatedMeal, meal.id)}
                    >
                        Modifica Pasto
                    </button>

                </div>

            </div>
        </div>
    );
}