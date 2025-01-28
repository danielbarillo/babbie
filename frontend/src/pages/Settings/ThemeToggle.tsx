import { useTheme } from '../../components/providers/ThemeProvider';
import { Button } from '../../components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose between light and dark theme
        </p>
      </div>
      <Button variant="outline" size="icon" onClick={toggleTheme}>
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}