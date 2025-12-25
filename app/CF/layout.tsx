import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloudflare Edge Cache Demo | Frontend Sunum',
  description: 'Cloudflare Edge Computing & Cache Layers - Frontend Takımı Sunumu',
};

export default function CFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{
        // Gradient orbs as CSS background - no CLS
        backgroundImage: `
          radial-gradient(ellipse 600px 600px at 25% 0%, rgba(249, 115, 22, 0.05), transparent),
          radial-gradient(ellipse 600px 600px at 75% 100%, rgba(59, 130, 246, 0.05), transparent),
          url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzBoLTR2MTBoMTBWMzBIMzZ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      {children}
    </div>
  );
}

