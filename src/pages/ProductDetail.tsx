import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Star, Truck, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⬇️ جلب المنتج من الباكند
  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Chargement...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <img
          src="/images/not-found.svg"
          alt="Produit non trouvé"
          className="w-48 h-48 mb-6"
        />
        <h1 className="text-3xl font-bold mb-2 text-red-600">
          Produit non trouvé
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Désolé, nous n'avons pas trouvé ce produit.
        </p>
        <Link to="/products">
          <Button size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux produits
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux produits
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} / 5
                </span>
              </div>

              <p className="text-3xl font-bold text-primary mb-6">
                  {Number(product.price).toFixed(2)} €
              </p>

            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                <span>Livraison gratuite sur commandes de plus de 50€</span>
              </div>
              <div className="flex items-center text-sm">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                <span>Garantie 2 ans incluse</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium">Stock:</span>
                <span className="ml-2 text-muted-foreground">
                  {product.stock} unités disponibles
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
            </Button>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  Informations de livraison
                </h3>
                <p className="text-sm text-muted-foreground">
                  Livraison standard: 3-5 jours ouvrables <br />
                  Livraison express: 1-2 jours (supplément 9,99€)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
