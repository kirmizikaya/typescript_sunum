import { EmlakjetPriceHistory, EmlakjetPriceDetail } from '../types/emlakjet-api';
import { formatListingPrice } from '../lib/property-service';

interface PriceHistorySectionProps {
  priceHistories: EmlakjetPriceHistory[];
  currentPrice: EmlakjetPriceDetail;
}

/**
 * Fiyat Bilgisi Section - SSR Component
 * 
 * Fiyat Endeksi ve Fiyat Geçmişi tabları.
 * Görseldeki gibi tablo formatında gösterim.
 */
export function PriceHistorySection({ priceHistories, currentPrice }: PriceHistorySectionProps) {
  // Fiyat geçmişi yoksa gösterme
  if (!priceHistories || priceHistories.length === 0) return null;

  // İlk fiyatı ve son fiyatı belirle
  const sortedHistory = [...priceHistories].sort(
    (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
  );

  const firstEntry = sortedHistory[0];
  const lastEntry = sortedHistory[sortedHistory.length - 1];

  // Tablo satırlarını oluştur
  const tableRows = sortedHistory.map((history, index) => {
    const isFirst = index === 0;
    const isLast = index === sortedHistory.length - 1;
    
    return {
      date: new Date(history.changedAt).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      status: isLast ? 'Son Fiyat' : isFirst ? 'İlk Fiyat' : 'Fiyat Değişikliği',
      price: history.price,
      currency: history.currency,
      trend: history.trend,
    };
  }).reverse(); // En son fiyat üstte

  return (
    <section className="border-t border-gray-200 py-6">
      <div className="px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fiyat Bilgisi</h2>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
            Fiyat Endeksi
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-[#58b847]">
            Fiyat Geçmişi
          </button>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tarih</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Durum</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr 
                  key={index} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-4 text-sm text-gray-700">{row.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 text-center">{row.status}</td>
                  <td className="px-4 py-4 text-sm text-right">
                    <span className="flex items-center justify-end gap-1">
                      {row.trend === 'DOWN' && (
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      {row.trend === 'UP' && (
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      )}
                      <span className="font-semibold text-gray-900">
                        {formatListingPrice(row.price, row.currency)}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {currentPrice.differenceRate > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Fiyat Düştü!</strong> İlk fiyattan{' '}
              <span className="font-semibold">%{currentPrice.differenceRate}</span> indirimli.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

