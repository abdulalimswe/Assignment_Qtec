import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "@/components/NavLink";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">Q</span>
          </div>
          <span className="text-xl font-bold text-foreground">QuickHire</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeClassName="text-primary">Home</NavLink>
          <NavLink to="/jobs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeClassName="text-primary">Jobs</NavLink>
          <NavLink to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeClassName="text-primary">About</NavLink>
          <NavLink to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeClassName="text-primary">Contact</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" asChild>
            <Link to="/admin">Admin</Link>
          </Button>
          <Button asChild>
            <Link to="/admin">Post a Job</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            <NavLink to="/" className="text-sm font-medium text-muted-foreground" activeClassName="text-primary" onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to="/jobs" className="text-sm font-medium text-muted-foreground" activeClassName="text-primary" onClick={() => setMobileOpen(false)}>Jobs</NavLink>
            <NavLink to="/about" className="text-sm font-medium text-muted-foreground" activeClassName="text-primary" onClick={() => setMobileOpen(false)}>About</NavLink>
            <NavLink to="/contact" className="text-sm font-medium text-muted-foreground" activeClassName="text-primary" onClick={() => setMobileOpen(false)}>Contact</NavLink>
            <Button className="mt-2 w-full" asChild>
              <Link to="/admin" onClick={() => setMobileOpen(false)}>Post a Job</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
