export type ThemeColors = "Default" | "Red" | "Rose" | "Orange" | "Green" | "Blue" | "Yellow" | "Violet";

export interface ThemeColorsStateParams {
	themeColor: ThemeColors;
	setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}
