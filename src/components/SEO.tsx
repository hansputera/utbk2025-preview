import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  keywords?: string[];
  noIndex?: boolean;
}

const defaultDescription = 'Pantau prestasi UTBK 2025, cek passing grade, dan lihat statistik kampus dengan UTBK Tracker. Dapatkan informasi lengkap tentang SNBT dan perguruan tinggi favorit.';
const defaultImage = 'https://utbk2025.hanifu.id/og-image.jpg';
const siteUrl = 'https://utbk2025.hanifu.id';

export const SEO: React.FC<SEOProps> = ({
  title = 'UTBK Tracker - Pantau Prestasi UTBK 2025',
  description = defaultDescription,
  image = defaultImage,
  type = 'website',
  keywords = ['UTBK', 'SNBT', '2025', 'passing grade', 'kampus', 'perguruan tinggi', 'universitas', 'prestasi', 'nilai', 'statistik', 'pendidikan'],
  noIndex = false,
}) => {
  const { pathname } = useLocation();
  const canonicalUrl = `${siteUrl}${pathname}`;

  return (
    <HelmetProvider>
      <Helmet>
        <html lang="id" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="robots" content={noIndex ? 'noindex, follow' : 'index, follow'} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content="UTBK Tracker" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="UTBK Tracker" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Helmet>
    </HelmetProvider>
  );
};

export default SEO;
