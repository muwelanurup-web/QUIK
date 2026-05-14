import '../styles/globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'QUIK – Fast Local Commerce',
  description: 'Shop from nearby retailers, fast. QUIK connects customers and local businesses.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#070d1a] text-white antialiased">
        {/* Animated background — fixed, behind everything */}
        <div className="animated-bg" aria-hidden="true">
          {/* Extra mid blue orb */}
          <div
            className="absolute top-[40%] left-[55%] w-[500px] h-[500px] rounded-full opacity-20 animate-float2"
            style={{
              background: 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)',
            }}
          />
        </div>

        <Navbar />
        <main className="page-content">{children}</main>
      </body>
    </html>
  );
}
