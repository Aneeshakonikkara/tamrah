import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloatingButton from './WhatsAppFloatingButton';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF9] text-[#1A1916]">
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Floating WhatsApp contact button across entire site */}
      <WhatsAppFloatingButton />
    </div>
  );
}
