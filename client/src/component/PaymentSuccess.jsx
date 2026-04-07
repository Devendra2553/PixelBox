import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import userBaseUrl from '../axioInstance';

const PaymentSuccess = () => {
  const [searchQuery] = useSearchParams();
  const reference = searchQuery.get("reference");
  const orderId = searchQuery.get("orderId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalizeOrder = async () => {
      if (!orderId || !reference) {
        setLoading(false);
        return;
      }

      try {
        await userBaseUrl.put(`/orders/${orderId}`, {
          paymentStatus: "paid",
          orderStatus: "placed",
          paymentMethod: "ONLINE",
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to update order status:", err);
        setLoading(false);
      }
    };

    finalizeOrder();
  }, [orderId, reference]);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff751f] mb-4"></div>
            <p className="text-gray-500 animate-pulse">Confirming your payment...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle size={80} className="text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been placed and is being processed.
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm">Reference ID:</span>
                <span className="text-gray-900 font-mono text-sm font-semibold">{reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Status:</span>
                <span className="text-green-600 text-sm font-bold uppercase">Paid</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                to="/cart" 
                className="flex items-center justify-center gap-2 w-full bg-[#ff751f] text-white py-3 rounded-xl font-bold hover:bg-[#e66412] transition-all"
              >
                <Package size={18} />
                View My Orders
              </Link>
              
              <Link 
                to="/" 
                className="flex items-center justify-center gap-2 w-full text-gray-600 py-2 font-medium hover:text-gray-900 transition-all"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;