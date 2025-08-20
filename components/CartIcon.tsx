import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ShoppingBag } from 'lucide-react';

const CartIcon: React.FC = () => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <ReactRouterDOM.Link to="/cart" className="relative text-brand-primary dark:text-dark-text hover:text-brand-secondary dark:hover:text-dark-accent transition-colors">
      <ShoppingBag className="h-7 w-7" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-brand-accent dark:bg-dark-accent text-white dark:text-dark-bg text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </ReactRouterDOM.Link>
  );
};

export default CartIcon;