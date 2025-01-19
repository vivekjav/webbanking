'use client';

import Link from 'next/link';
import { BANK_NAME, BANK_TAGLINE, BANK_FEATURES } from '@/constants';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/90 to-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{BANK_NAME}</h1>
            <p className="text-xl mb-8">{BANK_TAGLINE}</p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Open Account
              </Link>
              <Link
                href="/about"
                className="bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark/90 border border-white/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose {BANK_NAME}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BANK_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Personal Banking</h3>
              <p className="text-gray-600 mb-4">
                Manage your daily finances with our comprehensive personal banking solutions.
              </p>
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Get Started →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">International Banking</h3>
              <p className="text-gray-600 mb-4">
                Send and receive money globally with competitive exchange rates.
              </p>
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Learn More →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Investment Solutions</h3>
              <p className="text-gray-600 mb-4">
                Grow your wealth with our range of investment and savings products.
              </p>
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Explore Options →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join millions of satisfied customers worldwide.</p>
          <Link
            href="/register"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Open Your Account Today
          </Link>
        </div>
      </section>
    </div>
  );
}
