import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  
  // Assuming the order details are passed through state
  const order = location.state?.order;

  if (!order) {
    return <div>No order found!</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600">Thank You for Your Order!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Your order has been successfully placed. We will notify you once your order is processed and shipped.
        </p>
      </div>

      {/* Order Details Section */}
      <section className="mt-12 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
        <div className="mt-4">
          <p className="text-lg text-gray-700">
            <strong>Order Number:</strong> {order.orderNumber}
          </p>
          <p className="mt-2 text-lg text-gray-700">
            <strong>Shipping Information:</strong>
          </p>
          <p className="text-gray-700">
            Name: {order.shippingInfo.name}
          </p>
          <p className="text-gray-700">
            Address: {order.shippingInfo.address}
          </p>
          <p className="text-gray-700">
            Email: {order.shippingInfo.email}
          </p>
        </div>

        {/* Products Ordered */}
        <h3 className="mt-6 text-xl font-semibold text-gray-900">Products Ordered</h3>
        <div className="mt-4 space-y-4">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center border-b py-3">
              <div className="flex items-center gap-4">
                <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                </div>
              </div>
              <p className="font-semibold text-lg">₦{item.price * item.qty}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between font-semibold text-xl mt-4 border-t pt-4">
          <span>Total</span>
          <span>₦{order.totalPrice}</span>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600">You can now <Link to="/products" className="text-green-600 hover:underline">continue shopping</Link>.</p>
        {/* <Link to="/checkout" className="mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          View Order Details
        </Link> */}
      </div>
    </div>
  );
};

export default OrderConfirmation;
