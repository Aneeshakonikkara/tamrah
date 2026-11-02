import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { buildGeneralEnquiryUrl, BUSINESS_NAME } from '../../config/whatsapp';

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const generalWhatsAppUrl = buildGeneralEnquiryUrl();

  return (
    <aside
      aria-label="Direct WhatsApp Concierge"
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex items-center group"
    >
      {/* Subtle Tooltip on Hover / First Glance */}
      <div
        className={`hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 bg-[#1A1916] text-[#FDFCF9] text-xs font-light tracking-wide shadow-lg border border-[#3A3834] transition-all duration-300 pointer-events-none ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
        <span>Chat with {BUSINESS_NAME}</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={generalWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#128C7E] hover:bg-[#0E6C61] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8943F] focus-visible:ring-offset-2"
        aria-label={`Chat with ${BUSINESS_NAME} on WhatsApp`}
        title={`Chat with ${BUSINESS_NAME} on WhatsApp`}
      >
        <MessageCircle size={24} className="fill-current/10" />
        <span className="sr-only">WhatsApp Enquiry</span>
      </a>
    </aside>
  );
}
