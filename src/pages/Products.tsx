import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
 <div className="min-h-screen bg-background">
  <Header />

  <div className="container mx-auto px-6 py-12">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-900 dark:text-white">
      Nos Produits
    </h1>

    {/* 🔍 Search & Filter */}
    <div className="mb-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="pl-12 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1">
          <TabsList className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>

    {/* 🛍️ Products Grid */}
    {filteredProducts.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg rounded-2xl"
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
    ) : (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground mb-4">Aucun produit trouvé</p>
        <Button
          variant="outline"
          className="mt-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        >
          Réinitialiser les filtres
        </Button>
      </div>
    )}
  </div>

  {/* 🌟 CSS Animation */}
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