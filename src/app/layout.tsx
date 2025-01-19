import './globals.css';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { BANK_NAME } from '@/constants';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: BANK_NAME,
  description: 'Your trusted global banking partner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white border-b border-gray-200">
              <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">🏦</span>
                  <span className="text-xl font-bold">{BANK_NAME}</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/login" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </nav>
            </header>
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-8">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{BANK_NAME}</h3>
                    <p className="text-gray-600">
                      Your trusted banking partner, providing secure and innovative financial solutions globally.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/about" className="text-gray-600 hover:text-primary">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-gray-600 hover:text-primary">
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link href="/terms" className="text-gray-600 hover:text-primary">
                          Terms & Conditions
                        </Link>
                      </li>
                      <li>
                        <Link href="/privacy" className="text-gray-600 hover:text-primary">
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>📞 24/7 Support: 1-800-GLOBAL-BANK</li>
                      <li>📧 support@globalbank.com</li>
                      <li>📍 123 Banking Street, Financial District</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
                  <p>© {new Date().getFullYear()} {BANK_NAME}. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
