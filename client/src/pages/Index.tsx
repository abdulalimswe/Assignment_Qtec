import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import CTABanner from "@/components/CTABanner";
import FeaturedJobs from "@/components/FeaturedJobs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <FeaturedJobs />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
