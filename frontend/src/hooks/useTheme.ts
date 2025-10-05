import { useTheme as useThemeContext } from "@/providers/theme.provider";

export { useTheme } from "@/providers/theme.provider";

export const useThemeUtils = () => {
  const { theme, setTheme, resolvedTheme } = useThemeContext();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const isLight = resolvedTheme === "light";
  const isDark = resolvedTheme === "dark";
  const isSystem = theme === "system";

  return {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
    isLight,
    isDark,
    isSystem,
  };
};


