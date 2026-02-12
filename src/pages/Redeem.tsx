import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X } from 'lucide-react';
import { toast } from 'sonner';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageTransition from '../components/PageTransition';

interface Product {
  id: string;
  name: string;
  type: '1g_bar' | '5g_coin' | '10g_swiss_bar';
  weight: string;
  image: string;
  priceEstimate: string; // Placeholder for dynamic pricing
}

const products: Product[] = [
  {
    id: '1',
    name: '24K 1g Gold Chip',
    type: '1g_bar',
    weight: '1 gram',
    image: 'https://images.unsplash.com/photo-1620288627228-ee1578f7e268?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    priceEstimate: '$80 - $90',
  },
  {
    id: '2',
    name: '5g Minted Gold Coin',
    type: '5g_coin',
    weight: '5 grams',
    image: 'https://images.unsplash.com/photo-1610486800762-c651b75c8b21?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    priceEstimate: '$400 - $450',
  },
  {
    id: '3',
    name: '10g Swiss Gold Bar',
    type: '10g_swiss_bar',
    weight: '10 grams',
    image: 'https://images.unsplash.com/photo-1620288627228-ee1578f7e268?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    priceEstimate: '$800 - $900',
  },
];

const RedeemPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
    // Reset shipping address form if needed
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

  const handleRedeem = () => {
    if (!selectedProduct || Object.values(shippingAddress).some(val => val === '')) {
      toast.error('Please fill all shipping details.');
      return;
    }
    toast.success(`Redemption request for ${selectedProduct.name} submitted!`, {
      description: 'You will receive a confirmation email shortly.',
    });
    handleCloseDrawer(); // Close the drawer after submission
  };

  return (
    <PageTransition>
      <Container className="py-8 bg-black"> {/* Pure black background for the page */}
        <motion.h1
          className="text-4xl md:text-5xl font-light tracking-tight text-white mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Redeem Physical Gold
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-deepBlack/60 backdrop-blur-md p-6 flex flex-col items-center text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleProductClick(product)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src={product.image} alt={product.name} className="w-48 h-48 object-contain mb-4 rounded-lg" />
              <h3 className="text-xl font-light tracking-tight text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-1">{product.weight}</p>
              <p className="text-primary font-bold text-lg">{product.priceEstimate}</p>
              <Button className="mt-4">Redeem</Button>
            </Card>
          ))}
        </div>

        {/* Shipping Details Drawer */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-x-0 bottom-0 bg-deepBlack/80 backdrop-blur-xl border-t border-white/10 p-6 z-50 rounded-t-3xl shadow-2xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light tracking-tight text-white">
                  Shipping Details for {selectedProduct.name}
                </h2>
                <Button variant="ghost" onClick={handleCloseDrawer} className="text-white">
                  <X size={24} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input label="Full Name" name="name" value={shippingAddress.name} onChange={handleInputChange} />
                <Input label="Address Line 1" name="address1" value={shippingAddress.address1} onChange={handleInputChange} />
                <Input label="Address Line 2 (Optional)" name="address2" value={shippingAddress.address2} onChange={handleInputChange} />
                <Input label="City" name="city" value={shippingAddress.city} onChange={handleInputChange} />
                <Input label="State/Province" name="state" value={shippingAddress.state} onChange={handleInputChange} />
                <Input label="Zip/Postal Code" name="zip" value={shippingAddress.zip} onChange={handleInputChange} />
                <Input label="Country" name="country" value={shippingAddress.country} onChange={handleInputChange} />
              </div>

              <Button className="w-full" onClick={handleRedeem} icon={<Package />}>
                Confirm Redemption
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </PageTransition>
  );
};

export default RedeemPage;
