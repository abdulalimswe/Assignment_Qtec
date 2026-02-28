import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTABanner = () => {
  return (
    <section className="bg-primary py-20">
      <div className="container">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              Start posting jobs today
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Start posting jobs for free. Reach millions of job seekers and find the best talent for your company.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/admin">Sign Up For Free</Link>
            </Button>
          </div>
          <div className="hidden justify-end md:flex">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=400&fit=crop"
              alt="Team collaborating"
              className="rounded-2xl shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
