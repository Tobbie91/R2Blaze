import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cart"; // Assume this hook handles cart data

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useCart(); // Getting cart items from the store

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("whatsapp"); // Default to WhatsApp payment method

  if (items.length === 0) {
    return <div>Your cart is empty. Please add items before checking out.</div>;
  }
  const handlePlaceOrder = async () => {
    // Collect order data
    const orderData = {
      items: items,           // Cart items
      shippingInfo: shippingInfo, // Customer's shipping info
      paymentMethod: paymentMethod, // Payment method
    };

    // Generate the WhatsApp message with customer and order details
    const orderDetails = items
      .map(
        (item) => {
          // Dynamically calculate the total price for each item
          const totalPrice = item.price * item.qty; 
          console.log(`Item: ${item.name}, Qty: ${item.qty}, Price: ₦${totalPrice}`);
          return `Product: ${item.name}, Qty: ${item.qty}, Price: ₦${totalPrice}`;
        }
      )
      .join("\n");

    const message = `
      *Customer Details:*
      Name: ${shippingInfo.name}
      Address: ${shippingInfo.address}
      Email: ${shippingInfo.email}
      
      *Order Details:*
      ${orderDetails}

      Payment Method: ${paymentMethod}
    `;

    console.log("WhatsApp Message:", message); // Log the generated WhatsApp message to verify

    const encodedMessage = encodeURIComponent(message); // Encode the message for the URL

    // WhatsApp link with the pre-filled message
    const whatsappLink = `https://wa.me/2347018239270?text=${encodedMessage}`;

    // Redirect the user to WhatsApp to complete payment
    window.open(whatsappLink, "_blank");

    // Optionally, navigate to the confirmation page after placing the order
    navigate("/order-confirmation", { state: { order: orderData } });
};


  // Handle changes in shipping input fields
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="checkout-container bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-green-600 mb-8">Checkout</h2>

      {/* Order Summary */}
      <div className="order-summary bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">₦{item.price}</p>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              </div>
            </div>
            <p className="font-semibold text-lg">₦{item.price * item.qty}</p>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-4">
          <span>Total</span>
          <span>
            ₦{items.reduce((total, item) => total + item.price * item.qty, 0)}
          </span>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="shipping-info bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={handleShippingChange}
          className="w-full p-4 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          name="address"
          placeholder="Street Address"
          value={shippingInfo.address}
          onChange={handleShippingChange}
          className="w-full p-4 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={shippingInfo.email}
          onChange={handleShippingChange}
          className="w-full p-4 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Payment Method */}
      <div className="payment-info bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
        <div className="payment-method mb-4">
          <label className="block mb-2 font-medium text-lg">
            <input
              type="radio"
              name="paymentMethod"
              value="whatsapp"
              checked={paymentMethod === "whatsapp"}
              onChange={() => setPaymentMethod("whatsapp")}
              className="mr-2"
            />
            Pay via WhatsApp
          </label>
          <label className="block mb-2 font-medium text-lg">
            <input
              type="radio"
              name="paymentMethod"
              value="bankTransfer"
              checked={paymentMethod === "bankTransfer"}
              onChange={() => setPaymentMethod("bankTransfer")}
              className="mr-2"
            />
            Bank Transfer
          </label>
        </div>

        {/* Bank Transfer Info */}
        {paymentMethod === "bankTransfer" && (
          <div className="bank-transfer">
            <h4 className="font-semibold text-lg mb-2">Bank Details</h4>
            <p>Bank Name: Stanbic Bank</p>
            <p>Account Name: Odeode Emmanuel Gbenga</p>
            <p>Account Number: 0034591441</p>
           
          </div>
        )}
      </div>

      {/* Single Button to Place Order & Send to WhatsApp */}
      <div className="text-center">
        <button
          onClick={handlePlaceOrder}
          className="w-full py-4 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
        >
          Proceed with Payment on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Checkout;

