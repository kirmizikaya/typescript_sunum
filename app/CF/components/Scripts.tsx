'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Emlakjet Production SSR Scripts Simulation
 * 
 * Bu bileşen, gerçek bir Emlakjet sayfasında bulunan JavaScript kütüphanelerini
 * simüle eder. Lighthouse testlerinde gerçekçi sonuçlar elde etmek için kullanılır.
 * 
 * Dahil edilen scriptler:
 * - DataLayer (GTM için)
 * - Google Tag Manager (GTM)
 * - Efilli Cookie Consent
 * - Google Analytics 4
 * - Facebook Pixel
 * - Criteo
 * - RTB House
 * - Insider
 */

// DataLayer types
interface DataLayerEvent {
  event?: string;
  ecommerce?: {
    detail?: {
      products: Array<{
        name: string;
        id: string;
        price: string;
        brand: string;
        category: string;
        variant: string;
        dimension1?: string;
        dimension2?: string;
        dimension3?: string;
        dimension4?: string;
        dimension5?: string;
        dimension6?: string;
        dimension7?: string;
        dimension8?: string;
        dimension9?: string;
        dimension10?: string;
        dimension11?: string;
        dimension12?: string;
        dimension13?: string;
        dimension14?: string;
        dimension15?: string;
      }>;
    };
  };
  pageCategory?: string;
  pageType?: string;
  userId?: string | null;
  userType?: string;
  platform?: string;
  loginStatus?: string;
  listingId?: string;
  listingTitle?: string;
  listingCity?: string;
  listingDistrict?: string;
  listingTown?: string;
  listingType?: string;
  listingCategory?: string;
  listingPrice?: string;
  listingCurrency?: string;
  accountType?: string;
  accountId?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    criteo_q: unknown[];
    Insider: {
      eventManager: {
        dispatch: (event: string, data: unknown) => void;
      };
    };
    ef: {
      consent?: {
        getConsent: () => { analytics?: boolean; marketing?: boolean };
      };
    };
  }
}

// Listing data for DataLayer
const DEMO_LISTING_DATA = {
  id: '18248872',
  title: 'AVCILAR MERKEZ HAVUZLU SİTE GENİŞ BALKONLU 4+1 FIRSAT DAİRE',
  price: '5550000',
  currency: 'TL',
  city: 'İstanbul',
  district: 'Avcılar',
  town: 'Merkez',
  type: 'Konut',
  category: 'Satılık',
  subcategory: 'Daire',
  roomCount: '4+1',
  grossArea: '165',
  netArea: '150',
  buildingAge: '0',
  floorNumber: '10',
  totalFloors: '12',
  accountType: 'kurumsal',
  accountId: '3056712',
  accountName: 'Özer Group',
};

export function Scripts() {
  const pathname = usePathname();
  const isDemo = pathname?.startsWith('/CF/demos/');

  useEffect(() => {
    if (typeof window === 'undefined' || !isDemo) return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Push initial page view data
    window.dataLayer.push({
      event: 'gtm.js',
      'gtm.start': new Date().getTime(),
    });

    // Push ecommerce detail view (Emlakjet style)
    window.dataLayer.push({
      event: 'productDetailView',
      ecommerce: {
        detail: {
          products: [{
            name: DEMO_LISTING_DATA.title,
            id: DEMO_LISTING_DATA.id,
            price: DEMO_LISTING_DATA.price,
            brand: DEMO_LISTING_DATA.accountName,
            category: `${DEMO_LISTING_DATA.type}/${DEMO_LISTING_DATA.category}/${DEMO_LISTING_DATA.subcategory}`,
            variant: DEMO_LISTING_DATA.roomCount,
            dimension1: DEMO_LISTING_DATA.city,
            dimension2: DEMO_LISTING_DATA.district,
            dimension3: DEMO_LISTING_DATA.town,
            dimension4: DEMO_LISTING_DATA.grossArea,
            dimension5: DEMO_LISTING_DATA.netArea,
            dimension6: DEMO_LISTING_DATA.buildingAge,
            dimension7: DEMO_LISTING_DATA.floorNumber,
            dimension8: DEMO_LISTING_DATA.totalFloors,
            dimension9: DEMO_LISTING_DATA.accountType,
            dimension10: DEMO_LISTING_DATA.accountId,
          }]
        }
      }
    });

    // Push page info
    window.dataLayer.push({
      pageCategory: 'listing-detail',
      pageType: 'detail',
      userId: null,
      userType: 'visitor',
      platform: 'web',
      loginStatus: 'logged-out',
      listingId: DEMO_LISTING_DATA.id,
      listingTitle: DEMO_LISTING_DATA.title,
      listingCity: DEMO_LISTING_DATA.city,
      listingDistrict: DEMO_LISTING_DATA.district,
      listingTown: DEMO_LISTING_DATA.town,
      listingType: DEMO_LISTING_DATA.type,
      listingCategory: DEMO_LISTING_DATA.category,
      listingPrice: DEMO_LISTING_DATA.price,
      listingCurrency: DEMO_LISTING_DATA.currency,
      accountType: DEMO_LISTING_DATA.accountType,
      accountId: DEMO_LISTING_DATA.accountId,
    });

    // Initialize criteo_q
    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push(
      { event: 'setAccount', account: 12345 },
      { event: 'setSiteType', type: 'd' },
      { event: 'viewItem', item: DEMO_LISTING_DATA.id }
    );

  }, [isDemo, pathname]);

  if (!isDemo) return null;

  return (
    <>
      {/* Google Tag Manager - Head Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-DEMO123');
          `,
        }}
      />

      {/* Google Analytics 4 */}
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-DEMO123456"
      />
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DEMO123456', {
              page_title: '${DEMO_LISTING_DATA.title}',
              page_location: window.location.href,
              send_page_view: true
            });
          `,
        }}
      />

      {/* Efilli Cookie Consent (Simulated) */}
      <Script
        id="efilli-consent"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.ef = window.ef || {};
            window.ef.consent = {
              getConsent: function() {
                return { analytics: true, marketing: true, functional: true };
              },
              showBanner: function() {},
              hideBanner: function() {},
              acceptAll: function() {},
              rejectAll: function() {}
            };
            
            // Simulate cookie consent popup close after 3s (already accepted)
            console.log('[Efilli] Cookie consent loaded (demo simulation)');
          `,
        }}
      />

      {/* Facebook Pixel */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1234567890');
            fbq('track', 'PageView');
            fbq('track', 'ViewContent', {
              content_name: '${DEMO_LISTING_DATA.title}',
              content_ids: ['${DEMO_LISTING_DATA.id}'],
              content_type: 'product',
              value: ${DEMO_LISTING_DATA.price},
              currency: 'TRY'
            });
          `,
        }}
      />

      {/* Criteo */}
      <Script
        id="criteo-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.criteo_q = window.criteo_q || [];
            var deviceType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
            window.criteo_q.push(
              { event: "setAccount", account: 12345 },
              { event: "setSiteType", type: deviceType },
              { event: "viewItem", item: "${DEMO_LISTING_DATA.id}" }
            );
          `,
        }}
      />
      <Script
        id="criteo-loader"
        strategy="afterInteractive"
        src="//static.criteo.net/js/ld/ld.js"
      />

      {/* RTB House */}
      <Script
        id="rtbhouse-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,o){
              var f=d.getElementsByTagName(s)[0];
              var j=d.createElement(s);
              j.async=true;
              j.src='https://creatives.rtbhouse.com/tags/emlakjet.com.tr/tag.js';
              f.parentNode.insertBefore(j,f);
            })(window,document,'script');
            
            window.rtbhEvents = window.rtbhEvents || [];
            window.rtbhEvents.push({
              eventType: 'offer',
              offerId: '${DEMO_LISTING_DATA.id}'
            });
          `,
        }}
      />

      {/* Insider Web Push & Personalization */}
      <Script
        id="insider-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(i,s,o,g,r,a,m){i['InsiderObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)};a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://emlakjet.api.useinsider.com/ins.js','Insider');
            
            window.Insider = window.Insider || {};
            window.Insider.eventManager = window.Insider.eventManager || {
              dispatch: function(event, data) {
                console.log('[Insider] Event dispatched:', event, data);
              }
            };
            
            // Track listing view
            if (window.Insider && window.Insider.eventManager) {
              window.Insider.eventManager.dispatch('listing:view', {
                id: '${DEMO_LISTING_DATA.id}',
                title: '${DEMO_LISTING_DATA.title}',
                price: ${DEMO_LISTING_DATA.price},
                city: '${DEMO_LISTING_DATA.city}',
                district: '${DEMO_LISTING_DATA.district}'
              });
            }
          `,
        }}
      />

      {/* Hotjar - Session Recording & Heatmaps */}
      <Script
        id="hotjar-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:1234567,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
        }}
      />

      {/* Adjust (Mobile Attribution - Web SDK) */}
      <Script
        id="adjust-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(t,a,e,r,s,l,d,n,o){t.Adjust=t.Adjust||{},t.Adjust_q=t.Adjust_q||[];
            for(var c=0;c<l.length;c++)d(t.Adjust,t.Adjust_q,l[c]);
            n=a.createElement("script"),o=a.getElementsByTagName("script")[0],
            n.async=!0,n.src="https://cdn.adjust.com/adjust-latest.min.js",
            n.onload=function(){
              for(var a=0;a<t.Adjust_q.length;a++)
              t.Adjust[t.Adjust_q[a][0]].apply(t.Adjust,t.Adjust_q[a][1]);
              t.Adjust_q=[]
            },o.parentNode.insertBefore(n,o)}
            (window,document,0,0,0,["trackEvent","addGlobalCallbackParameters","addGlobalPartnerParameters","removeGlobalCallbackParameter","removeGlobalPartnerParameter","clearGlobalCallbackParameters","clearGlobalPartnerParameters","switchToOfflineMode","switchBackToOnlineMode","sendFirstPackages","gdprForgetMe","disableThirdPartySharing","initSdk"],
            function(t,a,e){t[e]=function(){a.push([e,arguments])}});
          `,
        }}
      />

      {/* Performance Monitoring (Simulated) */}
      <Script
        id="perf-monitoring"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Performance metrics collection (simulated)
            if (window.performance && window.performance.timing) {
              window.addEventListener('load', function() {
                setTimeout(function() {
                  var timing = window.performance.timing;
                  var metrics = {
                    dns: timing.domainLookupEnd - timing.domainLookupStart,
                    tcp: timing.connectEnd - timing.connectStart,
                    ttfb: timing.responseStart - timing.requestStart,
                    domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
                    windowLoad: timing.loadEventEnd - timing.navigationStart
                  };
                  console.log('[Performance] Metrics:', metrics);
                  
                  // Push to dataLayer
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: 'performanceMetrics',
                    performanceData: metrics
                  });
                }, 0);
              });
            }
            
            // Web Vitals (simulated)
            if ('PerformanceObserver' in window) {
              try {
                // LCP
                new PerformanceObserver(function(entryList) {
                  var entries = entryList.getEntries();
                  var lastEntry = entries[entries.length - 1];
                  console.log('[Web Vitals] LCP:', lastEntry.startTime);
                }).observe({type: 'largest-contentful-paint', buffered: true});
                
                // FID
                new PerformanceObserver(function(entryList) {
                  var entries = entryList.getEntries();
                  entries.forEach(function(entry) {
                    console.log('[Web Vitals] FID:', entry.processingStart - entry.startTime);
                  });
                }).observe({type: 'first-input', buffered: true});
                
                // CLS
                var clsValue = 0;
                new PerformanceObserver(function(entryList) {
                  var entries = entryList.getEntries();
                  entries.forEach(function(entry) {
                    if (!entry.hadRecentInput) {
                      clsValue += entry.value;
                      console.log('[Web Vitals] CLS:', clsValue);
                    }
                  });
                }).observe({type: 'layout-shift', buffered: true});
              } catch (e) {
                console.log('[Web Vitals] Observer not supported');
              }
            }
          `,
        }}
      />

      {/* Google Tag Manager - NoScript Fallback */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-DEMO123"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}

/**
 * Inline DataLayer Script - SSR için head'e eklenir
 * Bu script, sayfa yüklenmeden önce dataLayer'ı initialize eder
 */
export function DataLayerScript({ listingData }: { listingData?: typeof DEMO_LISTING_DATA }) {
  const data = listingData || DEMO_LISTING_DATA;
  
  const dataLayerContent = `
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'pageDataReady',
      'pageType': 'listing-detail',
      'pageName': '${data.title}',
      'listingId': '${data.id}',
      'listingType': '${data.type}',
      'listingCategory': '${data.category}',
      'listingCity': '${data.city}',
      'listingDistrict': '${data.district}',
      'listingTown': '${data.town}',
      'listingPrice': '${data.price}',
      'listingCurrency': '${data.currency}',
      'accountType': '${data.accountType}',
      'accountId': '${data.accountId}',
      'accountName': '${data.accountName}',
      'userLoggedIn': false,
      'platform': 'web-desktop'
    });
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: dataLayerContent }}
    />
  );
}

/**
 * Preconnect Links - Critical third-party domains
 * Bu linkler, üçüncü parti kaynaklara erken bağlantı kurulmasını sağlar
 */
export function PreconnectLinks() {
  return (
    <>
      {/* Google */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Facebook */}
      <link rel="preconnect" href="https://connect.facebook.net" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      
      {/* Criteo */}
      <link rel="preconnect" href="https://static.criteo.net" />
      <link rel="dns-prefetch" href="https://static.criteo.net" />
      
      {/* Insider */}
      <link rel="preconnect" href="https://emlakjet.api.useinsider.com" />
      <link rel="dns-prefetch" href="https://emlakjet.api.useinsider.com" />
      
      {/* Emlakjet CDN */}
      <link rel="preconnect" href="https://imaj.emlakjet.com" />
      <link rel="dns-prefetch" href="https://imaj.emlakjet.com" />
      
      {/* RTB House */}
      <link rel="preconnect" href="https://creatives.rtbhouse.com" />
      <link rel="dns-prefetch" href="https://creatives.rtbhouse.com" />
    </>
  );
}

export default Scripts;

