"use server";

import RecipePage from "./_components/recipe-page";

export interface Recipe {
	id: number;
	title: string;
	description: string;
	image: string;
	cookTime: number;
	servings: number;
	difficulty: "Facile" | "Moyen" | "Difficile";
	isFavorite: boolean;
	tags: string[];
}

const mockRecipes: Recipe[] = [
	{
		id: 1,
		title: "Risotto aux champignons",
		description:
			"Un risotto crémeux aux champignons de saison, parfait pour un dîner réconfortant.",
		image: "/images/placeholder.svg",
		cookTime: 35,
		servings: 4,
		difficulty: "Moyen",
		isFavorite: false,
		tags: ["Végétarien", "Italien", "Comfort food"],
	},
	{
		id: 2,
		title: "Tarte aux pommes classique",
		description:
			"Une tarte aux pommes traditionnelle avec une pâte brisée maison et des pommes caramélisées.",
		image: "/images/placeholder.svg",
		cookTime: 60,
		servings: 8,
		difficulty: "Moyen",
		isFavorite: false,
		tags: ["Dessert", "Français", "Automne"],
	},
	{
		id: 3,
		title: "Salade César maison",
		description:
			"Une salade César fraîche avec sa sauce authentique et ses croûtons croustillants.",
		image: "/images/placeholder.svg",
		cookTime: 15,
		servings: 2,
		difficulty: "Facile",
		isFavorite: false,
		tags: ["Salade", "Rapide", "Léger"],
	},
	{
		id: 4,
		title: "Bœuf bourguignon",
		description:
			"Le grand classique de la cuisine française, mijoté pendant des heures pour une tendreté parfaite.",
		image: "/images/placeholder.svg",
		cookTime: 180,
		servings: 6,
		difficulty: "Difficile",
		isFavorite: false,
		tags: ["Viande", "Français", "Mijoté"],
	},
	{
		id: 5,
		title: "Pâtes carbonara",
		description:
			"La vraie recette italienne des pâtes carbonara, simple et délicieuse.",
		image: "/images/placeholder.svg",
		cookTime: 20,
		servings: 4,
		difficulty: "Facile",
		isFavorite: false,
		tags: ["Pâtes", "Italien", "Rapide"],
	},
	{
		id: 6,
		title: "Soupe de butternut",
		description:
			"Une soupe veloutée de butternut avec une pointe de gingembre et lait de coco.",
		image: "/images/placeholder.svg",
		cookTime: 45,
		servings: 4,
		difficulty: "Facile",
		isFavorite: false,
		tags: ["Soupe", "Végétarien", "Automne"],
	},
];

export default async function Page() {
	return <RecipePage recipeList={mockRecipes} />;
}
