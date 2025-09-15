import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center bg-emerald-600 text-white py-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold">About R2blaze</h1>
        <p className="mt-4 text-xl">
          Discover how R2blaze is redefining the watch industry with premium timepieces and exceptional service.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mt-12 text-center bg-gray-50 py-10 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-emerald-600">Our Mission</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          At R2blaze, our mission is to provide premium, durable, and stylish watches that meet the needs of every individual, while offering them at an affordable price. We strive to make every customer feel special with our personalized service and world-class products.
        </p>
      </section>

      {/* History Section */}
      <section className="mt-12 text-center bg-white py-10 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-emerald-600">Our Story</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          Founded in 2023, R2blaze started as a small business focused on delivering exceptional quality watches. Over the years, we have grown into a trusted brand, with a wide selection of timepieces for every occasion. Our products are crafted with precision, ensuring quality, functionality, and style.
        </p>
      </section>

      {/* Call to Action Section */}
      <section className="mt-12 text-center bg-emerald-100 py-10 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-emerald-600">Join Our Journey</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          We're excited about the future and would love for you to be a part of it. Whether you're looking for a new timepiece or want to learn more about us, we're here to help. Join the R2blaze family today!
        </p>
        <Link to="/products" className="mt-6 inline-block px-6 py-3 rounded bg-emerald-600 text-white text-lg hover:bg-emerald-700 transition-all duration-200">
          Shop Now
        </Link>
      </section>
    </div>
  );
};

export default About;
