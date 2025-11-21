import { useState } from 'react'; // مهم جدا
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            LeCoinShop
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200">
            Accueil
          </Link>
          <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200">
            Produits
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center border rounded-lg overflow-hidden shadow-sm">
            <Input type="search" placeholder="Rechercher..." className="w-64 border-none focus:ring-0" />
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          <Link to="/login">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition rounded-full">
              <User className="h-5 w-5 text-gray-700" />
            </Button>
          </Link>

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition rounded-full">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Hamburger for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100 transition rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-background shadow-md md:hidden">
            <nav className="flex flex-col p-4 space-y-2">
              <Link to="/" className="text-gray-700 hover:text-primary">Accueil</Link>
              <Link to="/products" className="text-gray-700 hover:text-primary">Produits</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
