import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      currentPath
    );
    
    // Track 404 errors in analytics if needed
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: `404 - Page Not Found: ${currentPath}`,
        page_path: currentPath,
        non_interaction: true
      });
    }
  }, [currentPath]);

  return (
    <>
      <Helmet>
        <title>Halaman Tidak Ditemukan (404) - UTBK Tracker</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
            </p>
            <p className="text-sm text-gray-500">
              URL yang diminta: <code className="bg-gray-100 px-2 py-1 rounded">{currentPath}</code>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Kembali ke Beranda
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/dashboard">
                <Search className="w-4 h-4" />
                Lihat Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/universitas">
                <BookOpen className="w-4 h-4" />
                Daftar Universitas
              </Link>
            </Button>
          </div>
          
          <div className="pt-8 border-t border-gray-200 mt-8">
            <p className="text-sm text-gray-500">
              Butuh bantuan?{' '}
              <a 
                href="mailto:admin@utbk-tracker.app" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Hubungi Dukungan
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
