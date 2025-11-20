"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Recipe } from "@/generated/prisma";

type Ingredient = { name: string; unit: string; quantity: string };
type Instruction = { step: number; instruction: string };

type Labels = {
	serving: string;
	preparationTime: string;
	cookingTime: string;
	difficulty: string;
	difficultyValues: Record<string, string>;
	ingredients: string;
	noIngredients: string;
	instructions: string;
	noInstructions: string;
	tip: string;
};

const styles = StyleSheet.create({
	page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
	title: { fontSize: 20, marginBottom: 4, fontWeight: "bold" },
	description: { fontSize: 12, marginBottom: 12 },
	section: { marginBottom: 12 },
	subtitle: { fontSize: 14, marginBottom: 6, fontWeight: "bold" },
	listItem: { marginBottom: 4, fontSize: 12 },
	label: { fontWeight: "bold", marginTop: 10, marginBottom: 10 },
});

export default function RecipePdf({
	recipe,
	labels,
}: {
	recipe: Recipe;
	labels: Labels;
}) {
	const ingredients: Ingredient[] = Array.isArray(recipe.ingredients)
		? (recipe.ingredients as Ingredient[])
		: [];

	const instructions: Instruction[] = Array.isArray(recipe.instructions)
		? (recipe.instructions as Instruction[])
		: [];

	return (
		<Document>
			<Page style={styles.page}>
				<Text style={styles.title}>{recipe.title}</Text>
				{recipe.description && (
					<Text style={styles.description}>{recipe.description}</Text>
				)}

				<View style={styles.section}>
					<Text>
						<Text style={styles.label}>{labels.serving} </Text>
						{recipe.serving}
					</Text>
					<Text>
						<Text style={styles.label}>{labels.preparationTime} </Text>
						{recipe.preparationTime}
					</Text>
					<Text>
						<Text style={styles.label}>{labels.cookingTime} </Text>
						{recipe.cookingTime}
					</Text>
					<Text>
						<Text style={styles.label}>{labels.difficulty} </Text>
						{labels.difficultyValues[recipe.difficulty]}
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.subtitle}>{labels.ingredients}</Text>
					{ingredients.length > 0 ? (
						ingredients.map((item, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: index for key
							<Text key={index} style={styles.listItem}>
								{item.quantity
									? `${item.quantity} ${item.unit} ${item.name}`
									: item.name}
							</Text>
						))
					) : (
						<Text>{labels.noIngredients}</Text>
					)}
				</View>

				<View style={styles.section}>
					<Text style={styles.subtitle}>{labels.instructions}</Text>
					{instructions.length > 0 ? (
						instructions.map((step, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: index for key
							<Text key={index} style={styles.listItem}>
								{index + 1}. {step.instruction ?? JSON.stringify(step)}
							</Text>
						))
					) : (
						<Text>{labels.noInstructions}</Text>
					)}
				</View>

				{recipe.tip && (
					<View style={styles.section}>
						<Text style={styles.subtitle}>{labels.tip}</Text>
						<Text>{recipe.tip}</Text>
					</View>
				)}
			</Page>
		</Document>
	);
}
