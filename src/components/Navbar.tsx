import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Analyzer", path: "/analyzer" },
    { label: "Optimizer", path: "/optimizer" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm dark:shadow-[0_4px_30px_rgba(34,197,94,0.05)] transition-all duration-300 supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: LOGO */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Search className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-heading font-bold tracking-tight">
            SEO Toolkit
          </h1>
        </div>

        {/* CENTER: NAV TABS */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-muted/50 rounded-full border border-border/50">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-glow" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-border/50 bg-background/50 hover:bg-muted/80 hover:shadow-glow transition-all duration-300 group"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="h-4 w-4 text-foreground group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
