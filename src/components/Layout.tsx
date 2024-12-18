import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import PageTransition from './PageTransition';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navigation />
      <main className="flex-grow pt-20">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}