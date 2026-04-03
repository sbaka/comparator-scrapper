import { SearchLanding } from "@/components/SearchLanding";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { searchProductsServer } from "@/utils/supabase/server-queries";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const products = query ? await searchProductsServer(query) : [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="z-10 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex justify-end items-center fade-in">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <SearchLanding initialQuery={query} products={products} />
      </section>
    </main>
  );
}
