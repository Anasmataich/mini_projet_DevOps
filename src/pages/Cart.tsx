import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const total = getCartTotal();
  const shipping = total > 50 ? 0 : 9.99;
  const finalTotal = total + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag 
          className="h-28 w-28 mb-6 text-gray-400 animate-bounce" 
        />
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          Votre panier est vide
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-md">
          Découvrez nos produits de qualité et ajoutez-les à votre panier pour commencer vos achats
        </p>
        <Link to="/products">
          <Button size="lg" className="px-10 py-4 bg-primary text-white hover:scale-105 hover:shadow-lg transition-transform">
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
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
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
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-medium text-gray-800">{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="font-medium text-gray-800">
                      {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}
                    </span>
                  </div>
                  {total < 50 && (
                    <p className="text-sm text-gray-500">
                      Ajoutez {(50 - total).toFixed(2)} € pour la livraison gratuite
                    </p>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary">{finalTotal.toFixed(2)} €</span>
                </div>
                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full bg-primary text-white hover:shadow-lg hover:scale-105 transition-all">
                    Passer la commande
                  </Button>
                </Link>
                <p className="text-xs text-center text-gray-500">
                  Paiement sécurisé avec cryptage SSL
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
