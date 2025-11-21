import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import Header from '../components/Header';
import { useCart, CartItem } from '../context/CartContext';
import { toast } from 'sonner';
import { Product } from '../types';


export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const total = getCartTotal();
  const shipping = total > 50 ? 0 : 9.99;
  const finalTotal = total + shipping;
  const [products, setProducts] = useState<Product[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Commande confirmée ! Merci pour votre achat.', {
      duration: 3000,
    });
    clearCart();
    setTimeout(() => navigate('/'), 2000);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-12 px-4">
        <Link to="/cart">
          <Button variant="ghost" className="mb-6 flex items-center space-x-2 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Retour au panier
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-10 text-gray-800">Finaliser la commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="shadow-lg border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    📦 Informations de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        required 
                        className="border-gray-300"
                        placeholder="Jean" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        required 
                        className="border-gray-300"
                        placeholder="Dupont" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      className="border-gray-300"
                      placeholder="jean.dupont@exemple.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      required 
                      className="border-gray-300"
                      placeholder="+33 6 12 34 56 78" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input 
                      id="address" 
                      required 
                      className="border-gray-300"
                      placeholder="123 Rue de la Paix" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input 
                        id="city" 
                        required 
                        className="border-gray-300"
                        placeholder="Paris" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input 
                        id="postalCode" 
                        required 
                        className="border-gray-300"
                        placeholder="75001"
                        pattern="[0-9]{5}"
                        maxLength={5}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-lg border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    💳 Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-gray-700" />
                          <span className="font-medium">Carte bancaire</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer text-gray-700">
                        <span className="font-medium">PayPal</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          required 
                          className="border-gray-300"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Date d'expiration</Label>
                          <Input 
                            id="expiry" 
                            placeholder="MM/AA" 
                            required 
                            className="border-gray-300"
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv" 
                            placeholder="123" 
                            required 
                            className="border-gray-300"
                            maxLength={3}
                            pattern="[0-9]{3}"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500 pt-4 bg-blue-50 p-3 rounded-lg">
                    <Lock className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Paiement sécurisé avec cryptage SSL 256-bit</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20 shadow-lg border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    📋 Résumé de la commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cart.map((item: CartItem) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-800">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span className="font-medium text-gray-800">
                        {total.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison</span>
                      <span className="font-medium text-gray-800">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-semibold">Gratuite ✓</span>
                        ) : (
                          `${shipping.toFixed(2)} €`
                        )}
                      </span>
                    </div>
                    {total < 50 && (
                      <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                        💡 {(50 - total).toFixed(2)} € de plus pour la livraison gratuite
                      </p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary text-2xl">
                      {finalTotal.toFixed(2)} €
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                    <p className="mb-1">✓ Garantie satisfait ou remboursé</p>
                    <p>✓ Retour gratuit sous 30 jours</p>
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary text-white hover:scale-105 hover:shadow-lg transition-all font-semibold"
                  >
                    Confirmer la commande
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    🔒 Paiement 100% sécurisé
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}