// src/pages/Policies.tsx

import React from 'react';

const Policies = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Our Policies</h1>
        <p className="mt-4 text-lg text-gray-600">
          Please take a moment to review our policies to understand how we operate.
        </p>
      </div>

      {/* Privacy Policy Section */}
      <section className="mt-12 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900">Privacy Policy</h2>
        <p className="mt-4 text-lg text-gray-700">
          At [Your Company Name], we prioritize the protection of your personal data. Below is how we collect, use, and protect your information.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li><strong>Data Collection</strong>: We collect personal details such as your name, email, and payment information when you make a purchase or sign up on our site.</li>
          <li><strong>Data Usage</strong>: The data we collect helps us process your orders, send you promotions, and provide excellent customer service.</li>
          <li><strong>Data Security</strong>: We employ encryption and security protocols to ensure your data is safe.</li>
          <li><strong>Your Rights</strong>: You have the right to access, modify, or delete your personal data at any time by contacting us.</li>
        </ul>
      </section>

      {/* Terms and Conditions Section */}
      <section className="mt-12 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900">Terms and Conditions</h2>
        <p className="mt-4 text-lg text-gray-700">
          By using our website, you agree to abide by the following terms. Please read them carefully.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li><strong>Product Availability</strong>: All products are subject to availability. Prices may change without notice.</li>
          <li><strong>Order Cancellation</strong>: We reserve the right to cancel any order if there are issues with payment or product availability.</li>
          <li><strong>Intellectual Property</strong>: All content on this website is owned by [Your Company Name]. Unauthorized use is prohibited.</li>
          <li><strong>Limitation of Liability</strong>: We are not responsible for any indirect damages caused by using our services.</li>
        </ul>
      </section>

      {/* Return Policy Section */}
      <section className="mt-12 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900">Return Policy</h2>
        <p className="mt-4 text-lg text-gray-700">
          If you're not satisfied with your purchase, you can return it under the following conditions:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li><strong>Eligibility</strong>: The product must be unused and in its original packaging to be eligible for a return.</li>
          <li><strong>Return Process</strong>: To initiate a return, contact us within [X] days of receiving your order.</li>
          <li><strong>Refunds</strong>: Once we receive the returned item, we'll issue a refund to your original payment method within [X] business days.</li>
          <li><strong>Exclusions</strong>: Certain items, such as personalized or clearance products, may not be eligible for return.</li>
        </ul>
      </section>

      {/* Shipping Policy Section */}
      <section className="mt-12 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900">Shipping Policy</h2>
        <p className="mt-4 text-lg text-gray-700">
          We offer fast and reliable shipping to get your products to you quickly. Below is an overview of our shipping terms:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li><strong>Shipping Methods</strong>: We provide standard, expedited, and express shipping options.</li>
          <li><strong>Shipping Costs</strong>: Shipping fees are calculated based on your location and the total weight of your order.</li>
          <li><strong>Processing Time</strong>: Orders are processed within [X] business days. You'll receive a tracking number once your order ships.</li>
          <li><strong>International Shipping</strong>: We offer international shipping with additional charges for customs duties and taxes.</li>
        </ul>
      </section>

      {/* Contact Section (WhatsApp) */}
      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Need More Information?</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          If you have any questions about our policies or need further clarification, feel free to reach out to us via WhatsApp.
        </p>
        <a 
          href="https://wa.me/2348012345678" 
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block px-6 py-3 rounded bg-green-600 text-white text-lg"
        >
          Contact Us on WhatsApp
        </a>
      </section>
    </div>
  );
};

export default Policies;

