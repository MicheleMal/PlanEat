export interface Recipe {
    id?: number;
    title: string;
    description: string;
    prepTime: number;
    recipeIngredient: { 
        id?: number,
        quantity: number | null,
        unit: string,
        ingredient: {
            id?: number,
            name: string
        }
    }[];
}
