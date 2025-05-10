
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
      </span>
    </Button>
  );
}
