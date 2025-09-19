import { X } from "lucide-react";

export default function ModalRecipe({
    selected,
    setSelected,
    setShowForm,
    onDelete,
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg relative shadow-lg">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    onClick={() => setSelected(null)}
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">
                    {selected.title}
                </h2>
                <p className="text-gray-400 mb-2">{selected.description}</p>
                <p className="text-gray-400 mb-4">
                    Tempo: {selected.prepTime} minuti
                </p>
                <h3 className="text-lg font-semibold text-white mb-2">
                    Ingredienti
                </h3>
                <ul className="list-disc list-inside text-gray-300">
                    {selected.recipeIngredient.map((ing, i) => (
                        <li key={i}>
                            {ing.ingredient?.name} - {ing.quantity} {ing.unit}
                        </li>
                    ))}
                </ul>

                <div className="flex justify-between gap-3 mt-4">
                    <button
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
                        onClick={() => onDelete(selected.id)}
                    >
                        Elimina
                    </button>
                    <button
                        className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white"
                        onClick={() => setShowForm(prev => ({...prev, editing: true}))}
                    >
                        Modifica
                    </button>
                </div>
            </div>
        </div>
    );
}
