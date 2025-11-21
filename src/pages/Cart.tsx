import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import Header from '../components/Header';
import { useCart, CartItem } from '../context/CartContext';

// ✅ Composant pour afficher un article du panier
function CartItemCard({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}: { 
  item: CartItem; 
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-6">

          {/* Image du produit */}
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Informations du produit */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">{item.name}</h3>
              
              {/* ❗ Correction ici */}
              <p className="text-2xl font-bold text-primary">
                {Number(item.price).toFixed(2)} €
              </p>
            </div>

            {/* Contrôles de quantité */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm text-gray-600 font-medium">Quantité:</span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="w-12 text-center font-semibold text-lg">
                  {item.quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {item.quantity >= item.stock && (
                <span className="text-xs text-orange-600">Stock max atteint</span>
              )}
            </div>
          </div>

          {/* Bouton supprimer */}
          <div className="flex flex-col justify-between items-end">
            <Button
              variant="destructive"
              size="icon"
              onClick={onRemove}
              className="hover:scale-110 transition-transform"
            >
              <Trash2 className="h-5 w-5" />
            </Button>

            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>

              {/* ❗ Correction ici */}
              <p className="text-xl font-bold text-gray-800">
                {(Number(item.price) * item.quantity).toFixed(2)} €
              </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const total = getCartTotal();
  const shipping = total > 50 ? 0 : 9.99;
  const finalTotal = total + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="h-28 w-28 mb-6 text-gray-400 animate-bounce" />
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          Votre panier est vide
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-md">
          Découvrez nos produits de qualité et ajoutez-les à votre panier
        </p>

        <Link to="/products">
          <Button size="lg" className="px-10 py-4 bg-primary text-white hover:scale-105 hover:shadow-lg">
            Voir les produits
          </Button>
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          Ou retournez à <Link to="/" className="text-primary underline">l'accueil</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto py-12 px-4">
        
        <Link to="/products">
          <Button variant="ghost" className="mb-6 flex items-center space-x-2 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Continuer mes achats
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-10 text-gray-800">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-lg border border-gray-200 rounded-xl">
              <CardContent className="pt-6 space-y-6">

                <h2 className="text-2xl font-bold text-gray-800">Résumé de la commande</h2>

                <Separator />

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span className="text-sm">{item.name} × {item.quantity}</span>

                      {/* ❗ correction */}
                      <span className="font-medium text-gray-800">
                        {(Number(item.price) * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-medium">
                      {Number(total).toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600 font-semibold">
                      {shipping === 0 ? 'Gratuite ✓' : `${shipping.toFixed(2)} €`}
                    </span>
                  </div>

                  {total < 50 && (
                    <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      💡 Ajoutez {(50 - total).toFixed(2)} € pour la livraison gratuite
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary text-2xl">
                    {Number(finalTotal).toFixed(2)} €
                  </span>
                </div>

                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full bg-primary text-white hover:scale-105 hover:shadow-lg">
                    Passer la commande
                  </Button>
                </Link>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
