import { Link } from "react-router-dom";
import { Palette, TrendingUp, Megaphone, DollarSign, Monitor, Settings, Briefcase, Users } from "lucide-react";
import { categories } from "@/data/jobs";

const iconMap: Record<string, React.ElementType> = {
  Palette, TrendingUp, Megaphone, DollarSign, Monitor, Settings, Briefcase, Users,
};

const CategorySection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Explore by <span className="text-primary">Category</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Find jobs in your preferred field</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            return (
              <Link
                key={cat.name}
                to={`/jobs?category=${cat.name}`}
                className="group flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{cat.count} jobs available</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
