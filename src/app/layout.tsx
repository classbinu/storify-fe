'use client';

import './globals.css';

import { Provider } from 'react-redux';
import { store } from '../store/index';

import { Providers } from './providers';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/home/footer/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kr" data-theme="cupcake">
      <body className="bg-[#FAF3E0]">
        <Provider store={store}>
          <Providers>
            <NavigationBar />
            {children}
            <Footer />
          </Providers>
        </Provider>
      </body>
    </html>
  );
}
