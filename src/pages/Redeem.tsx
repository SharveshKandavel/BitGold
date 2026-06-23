import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X } from 'lucide-react';
import { toast } from 'sonner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface Product {
  id: string;
  name: string;
  type: '1g_bar' | '5g_coin' | '10g_swiss_bar';
  weight: string;
  image: string;
  priceEstimate: string;
}

const products: Product[] = [
  {
    id: '1',
    name: '24K 1g Gold Chip',
    type: '1g_bar',
    weight: '1 gram',
    image: '/gold_chip_1g.png',
    priceEstimate: '$80 - $90',
  },
  {
    id: '2',
    name: '5g Minted Gold Coin',
    type: '5g_coin',
    weight: '5 grams',
    image: '/gold_coin_5g.png',
    priceEstimate: '$400 - $450',
  },
  {
    id: '3',
    name: '10g Swiss Gold Bar',
    type: '10g_swiss_bar',
    weight: '10 grams',
    image: '/gold_bar_10g.png',
    priceEstimate: '$800 - $900',
  },
];

interface RedeemPageProps {
  setActiveTab?: (tab: string) => void;
}

const RedeemPage: React.FC<RedeemPageProps> = ({ setActiveTab }) => {
  const user = useCurrentUser();
  const createDeliveryRequest = useMutation(api.banking.createDeliveryRequest);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDrawer = () => {
    setSelectedProduct(null);
    setShippingAddress({
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedeem = async () => {
    if (!user) {
      toast.error('Please sign in to redeem gold.');
      return;
    }
    if (!selectedProduct) return;

    const hasEmptyFields = Object.entries(shippingAddress).some(([key, val]) => {
      if (key === 'address2') return false;
      return val.trim() === '';
    });

    if (hasEmptyFields) {
      toast.error('Please fill all required shipping details.');
      return;
    }

    let requiredGold = 1;
    if (selectedProduct.type === '5g_coin') requiredGold = 5;
    else if (selectedProduct.type === '10g_swiss_bar') requiredGold = 10;

    const goldBalance = user.goldBalance ?? 0;
    if (goldBalance < requiredGold) {
      toast.error(`Insufficient gold. You need at least ${requiredGold}g of gold to redeem this item.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await createDeliveryRequest({
        userId: user._id,
        item_type: selectedProduct.type,
        shipping_address: {
          name: shippingAddress.name,
          address1: shippingAddress.address1,
          address2: shippingAddress.address2 || undefined,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country,
        },
      });
      toast.success(`Redemption request for ${selectedProduct.name} submitted!`, {
        description: 'You will receive a confirmation email shortly.',
      });
      handleCloseDrawer();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit redemption request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <motion.h1
        className="page-title text-center text-3xl font-light mb-10 mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Redeem Physical Gold
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
        {products.map((product) => (
          <div
            key={product.id}
            className="card-primary flex flex-col items-center text-center cursor-pointer hover:border-primary transition-colors hover:bg-white/[0.08]"
            onClick={() => handleProductClick(product)}
          >
            <img src={product.image} alt={product.name} className="w-48 h-48 object-contain mb-4 rounded-lg" />
            <h3 className="text-lg font-medium text-white mb-1">{product.name}</h3>
            <p className="label-meta mb-1">{product.weight}</p>
            <p className="text-gold font-semibold text-lg">{product.priceEstimate}</p>
            <Button variant="gold" className="mt-4 w-full text-xs py-2">Redeem</Button>
          </div>
        ))}
      </div>

      {/* Shipping Details Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-x-0 bottom-0 bg-deepBlack border-t border-white/[0.08] p-6 z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-white">
                Shipping Details
              </h2>
              <Button variant="ghost" onClick={handleCloseDrawer} className="text-white p-2">
                <X size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input id="name" label="Full Name" name="name" value={shippingAddress.name} onChange={handleInputChange} />
              <Input id="address1" label="Address Line 1" name="address1" value={shippingAddress.address1} onChange={handleInputChange} />
              <Input id="address2" label="Address Line 2 (Optional)" name="address2" value={shippingAddress.address2} onChange={handleInputChange} />
              <Input id="city" label="City" name="city" value={shippingAddress.city} onChange={handleInputChange} />
              <Input id="state" label="State/Province" name="state" value={shippingAddress.state} onChange={handleInputChange} />
              <Input id="zip" label="Zip/Postal Code" name="zip" value={shippingAddress.zip} onChange={handleInputChange} />
              <Input id="country" label="Country" name="country" value={shippingAddress.country} onChange={handleInputChange} />
            </div>

            <Button variant="gold" fullWidth onClick={handleRedeem} icon={<Package />} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm Redemption'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RedeemPage;
