import { X } from "lucide-react";

export default function ModalRecipe({
  selected,
  setSelected,
  setShowForm,
  onDelete,
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg relative shadow-2xl">

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
          onClick={() => setSelected(null)}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-4">
          {selected.title}
        </h2>

        {/* Description */}
        <p className="text-zinc-400 mb-2">
          {selected.description}
        </p>

        <p className="text-zinc-400 mb-4">
          Tempo: <span className="text-emerald-400 font-medium">{selected.prepTime} min</span>
        </p>

        {/* Ingredients */}
        <h3 className="text-lg font-semibold text-white mb-2">
          Ingredienti
        </h3>

        <ul className="list-disc list-inside text-zinc-300 space-y-1 max-h-40 overflow-y-auto pr-2">
          {selected.recipeIngredient.map((ing, i) => (
            <li key={i}>
              {ing.ingredient?.name} - {ing.quantity} {ing.unit}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition"
            onClick={() => onDelete(selected.id)}
          >
            Elimina
          </button>

          <button
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-zinc-900 font-medium transition"
            onClick={() =>
              setShowForm((prev) => ({ ...prev, editing: true }))
            }
          >
            Modifica
          </button>
        </div>
      </div>
    </div>
  );
}