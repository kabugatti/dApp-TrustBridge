"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeUtils } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, isDark, isSystem } = useThemeUtils();

  const getIcon = () => {
    if (isSystem) return <Monitor className="h-4 w-4" />;
    if (isDark) return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4 text-white" />;
  };

  const getLabel = () => {
    if (isSystem) return "System";
    if (isDark) return "Dark";
    return "Light";
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0 hover:cursor-pointer transition-all duration-200"
          aria-label={`Current theme: ${getLabel()}. Click to change theme.`}
        >
          <div className="flex items-center hover:cursor-pointer justify-center">
            {getIcon()}
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[120px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-black dark:text-white transition-all duration-200"
        sideOffset={8}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer transition-colors duration-150"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer transition-colors duration-150"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer transition-colors duration-150"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

