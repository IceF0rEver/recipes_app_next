"use client";
import { type ThemeProviderProps, useTheme } from "next-themes";
import { createContext, useContext, useEffect, useState } from "react";
import setGlobalColorTheme from "@/lib/theme-colors";
import type { ThemeColors, ThemeColorsStateParams } from "@/types/theme-types";

const ThemeContext = createContext<ThemeColorsStateParams>({} as ThemeColorsStateParams);

export default function ThemeColorProvider({ children }: ThemeProviderProps) {
	const getSavedThemeColor = () => {
		try {
			return (localStorage.getItem("themeColor") as ThemeColors) || "Default";
		} catch (_error) {
			"Default" as ThemeColors;
		}
	};

	const [themeColor, setThemeColor] = useState<ThemeColors>(getSavedThemeColor() as ThemeColors);
	const [isMounted, setIsMounted] = useState(false);
	const { theme, systemTheme } = useTheme();

	useEffect(() => {
		localStorage.setItem("themeColor", themeColor);
		if (theme === "system") {
			setGlobalColorTheme(systemTheme as "light" | "dark", themeColor);
		} else {
			setGlobalColorTheme(theme as "light" | "dark", themeColor);
		}

		if (!isMounted) {
			setIsMounted(true);
		}
	}, [themeColor, theme]);

	if (!isMounted) {
		return null;
	}

	return <ThemeContext.Provider value={{ themeColor, setThemeColor }}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
	return useContext(ThemeContext);
}
