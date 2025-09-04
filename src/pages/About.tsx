// src/pages/About.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900">About Us</h1>
        <p className="mt-4 text-xl text-gray-600">
          Learn more about our company and how we're transforming the watch industry.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          At [Your Company Name], our mission is to provide premium, durable, and stylish watches that meet the needs of every individual, while offering them at an affordable price. We strive to make every customer feel special with our personalized service and world-class products.
        </p>
      </section>

      {/* History Section */}
      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          Founded in [Year], [Your Company Name] started as a small business focused on delivering exceptional quality watches. Over the years, we have grown into a trusted brand, with a wide selection of timepieces for every occasion. Our products are crafted with precision, ensuring quality, functionality, and style.
        </p>
      </section>

      {/* Team Section */}
      {/* <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {/* Team Member 1 */}
          {/* <div className="flex flex-col items-center">
            <img src="/images/team-member-1.jpg" alt="Team Member" className="w-32 h-32 object-cover rounded-full mb-4" />
            <h3 className="text-xl font-semibold">John Doe</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>

          {/* Team Member 2 */}
          {/* <div className="flex flex-col items-center">
            <img src="/images/team-member-2.jpg" alt="Team Member" className="w-32 h-32 object-cover rounded-full mb-4" />
            <h3 className="text-xl font-semibold">Jane Smith</h3>
            <p className="text-gray-600">Chief Operating Officer</p>
          </div> */}

          {/* Team Member 3 */}
          {/* <div className="flex flex-col items-center">
            <img src="/images/team-member-3.jpg" alt="Team Member" className="w-32 h-32 object-cover rounded-full mb-4" />
            <h3 className="text-xl font-semibold">Sarah Williams</h3>
            <p className="text-gray-600">Head of Marketing</p>
          </div> */}

          {/* Team Member 4 */}
          {/* <div className="flex flex-col items-center">
            <img src="/images/team-member-4.jpg" alt="Team Member" className="w-32 h-32 object-cover rounded-full mb-4" />
            <h3 className="text-xl font-semibold">Michael Brown</h3>
            <p className="text-gray-600">Lead Designer</p>
          </div>
        </div> */} 
      {/* </section> */}

      {/* Call to Action Section */}
      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Join Our Journey</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          We're excited about the future and would love for you to be a part of it. Whether you're looking for a new timepiece or want to learn more about us, we're here to help. Join the [Your Company Name] family today!
        </p>
        <Link to="/products" className="mt-6 inline-block px-6 py-3 rounded bg-emerald-600 text-white text-lg">
          Shop Now
        </Link>
      </section>
    </div>
  );
};

export default About;
