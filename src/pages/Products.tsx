import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tous"]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Charger les produits depuis le backend
  useEffect(() => {
    const loadProducts = async () => {
      console.log('🔄 Chargement des produits...');
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch("http://localhost:5000/products");
        
        console.log('📡 Réponse reçue:', response.status);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Données reçues:', data);
        
        if (!Array.isArray(data)) {
          throw new Error("Format de données invalide");
        }
        
        // Convertir les prix en nombres
        const productsWithNumbers = data.map(p => ({
          ...p,
          price: typeof p.price === 'string' ? parseFloat(p.price) : p.price
        }));
        
        setProducts(productsWithNumbers);
        console.log('✅ Produits chargés:', productsWithNumbers.length);

        // Extraire les catégories uniques
        const uniqueCategories = Array.from(
          new Set(productsWithNumbers.map(p => p.category).filter(Boolean))
        ) as string[];
        
        setCategories(["Tous", ...uniqueCategories]);
        console.log('📂 Catégories:', ["Tous", ...uniqueCategories]);
        
      } catch (err) {
        console.error('❌ Erreur:', err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ✅ Filtrer les produits par catégorie et recherche
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "Tous" || product.category === selectedCategory;

    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // ✅ Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Tous");
  };

  // 🐛 Debug: Afficher l'état actuel
  console.log('🔍 État actuel:', {
    loading,
    error,
    productsCount: products.length,
    filteredCount: filteredProducts.length
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">
            Nos Produits
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez notre sélection de {products.length} produits de qualité
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un produit..."
                className="pl-12 pr-10 py-2 rounded-lg border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filtre par catégorie */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="flex-1"
              >
                <TabsList className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Indicateur de filtres actifs */}
          {(searchQuery || selectedCategory !== "Tous") && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-600">Filtres actifs:</span>
              {searchQuery && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Recherche: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "Tous" && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Catégorie: {selectedCategory}
                  <button onClick={() => setSelectedCategory("Tous")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-sm"
              >
                Tout réinitialiser
              </Button>
            </div>
          )}
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        )}

        {/* Erreur */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">❌ {error}</p>
              <p className="text-sm text-gray-600 mb-4">
                Vérifiez que le backend est démarré sur http://localhost:5000
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Grille de produits */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="transition-all hover:-translate-y-2 hover:shadow-lg rounded-2xl"
                  style={{
                    animation: `fadeInUp 0.6s ease forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Aucun produit trouvé */}
        {!loading && !error && filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <Search className="h-20 w-20 mx-auto text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}"`
                : "Aucun produit ne correspond à vos critères de recherche"}
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="mx-auto"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
