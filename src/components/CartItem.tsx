import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Product } from '../types';

interface CartItemProps {
  item: Product & { quantity: number };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />

        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.category}</p>
          <p className="text-lg font-bold text-primary mt-1">
              {Number(item.price).toFixed(2)} €
          </p>

        </div>

        <div className="flex items-center space-x-2">

          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span className="w-8 text-center font-medium">{item.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-right">
          <p className="font-bold text-lg">
             {Number(item.price * item.quantity).toFixed(2)} €
          </p>


          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        </div>

      </div>
    </Card>
  );
}
