import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">Q</span>
              </div>
              <span className="text-xl font-bold">QuickHire</span>
            </div>
            <p className="text-sm opacity-70">
              Your gateway to finding the perfect job or the perfect candidate. Join thousands of professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-70 transition-opacity hover:opacity-100">Home</Link>
              <Link to="/jobs" className="text-sm opacity-70 transition-opacity hover:opacity-100">Browse Jobs</Link>
              <Link to="/admin" className="text-sm opacity-70 transition-opacity hover:opacity-100">Post a Job</Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Categories</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/jobs?category=Technology" className="text-sm opacity-70 transition-opacity hover:opacity-100">Technology</Link>
              <Link to="/jobs?category=Design" className="text-sm opacity-70 transition-opacity hover:opacity-100">Design</Link>
              <Link to="/jobs?category=Marketing" className="text-sm opacity-70 transition-opacity hover:opacity-100">Marketing</Link>
              <Link to="/jobs?category=Finance" className="text-sm opacity-70 transition-opacity hover:opacity-100">Finance</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Newsletter</h4>
            <p className="text-sm opacity-70">Subscribe to get the latest job updates.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="border-background/20 bg-background/10 text-background placeholder:text-background/50" />
              <Button size="icon" className="shrink-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-background/20 pt-6 text-center">
          <p className="text-sm opacity-60">© 2024 QuickHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
