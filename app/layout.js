import './globals.css';

export const metadata = {
  title: 'AI Agent Hub',
  description: 'Hệ thống AI Agent phục vụ doanh nghiệp',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen" style={{ background: '#F5F4FF', color: '#1a1535' }}>
        {children}
      </body>
    </html>
  );
}
