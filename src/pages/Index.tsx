import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck, Shield, CreditCard } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { Product } from '../types';


export default function Index() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  // ⬇️ جلب المنتجات من الـ backend
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du fetch des produits:", err);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Chargement des produits...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Bienvenue sur <span className="text-cyan-300">LeCoinShop</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl leading-relaxed">
              Découvrez une sélection unique de produits électroniques et d’accessoires modernes, 
              alliant performance, innovation et prix imbattables — le tout à portée de clic.
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="group bg-white text-blue-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300">
                Explorer les produits
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Pourquoi choisir <span className="text-blue-600">LeCoinShop</span> ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="pt-8 text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Livraison Gratuite</h3>
                <p className="text-sm text-muted-foreground">
                  Profitez d'une livraison rapide et gratuite dès 50€ d'achat.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="pt-8 text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Paiement Sécurisé</h3>
                <p className="text-sm text-muted-foreground">
                  Nous garantissons la sécurité de toutes vos transactions.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="pt-8 text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Paiement Flexible</h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez parmi plusieurs moyens de paiement modernes.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="pt-8 text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Retours Simples</h3>
                <p className="text-sm text-muted-foreground">
                  Changez d'avis facilement grâce à notre politique de retour flexible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 sm:mb-0">
              Produits Populaires
            </h2>
            <Link to="/products">
              <Button
                variant="secondary"
                className="group flex items-center gap-2 transition-all duration-300 hover:gap-3"
              >
                Explorer tout
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl"
                style={{
                  animation: `fadeInUp 0.6s ease forwards`,
                  animationDelay: `${index * 0.15}s`,
                  opacity: 0,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>
      {`
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(40px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      `}
      </style>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">LeCoinShop</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Votre destination pour les produits électroniques et accessoires de qualité.
          </p>
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="hover:text-yellow-300 transition">Accueil</a>
            <a href="#" className="hover:text-yellow-300 transition">Produits</a>
            <a href="#" className="hover:text-yellow-300 transition">Contact</a>
            <a href="#" className="hover:text-yellow-300 transition">À propos</a>
          </div>
          <div className="border-t border-blue-400/30 pt-4 text-sm text-blue-100">
            <p>&copy; {new Date().getFullYear()} LeCoinShop. Tous droits réservés.</p>
            <p className="mt-1">Projet de démonstration DevOps | React + Tailwind</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
