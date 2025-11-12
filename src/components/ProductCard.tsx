import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center space-x-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.stock} en stock)</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">
          {product.price.toFixed(2)} €
        </span>
        <Button onClick={handleAddToCart} size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  );
}