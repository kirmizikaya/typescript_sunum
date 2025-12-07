// 1 -)
// Partial<T>
// Tüm property'leri opsiyonel yapar.

interface Gorev {
    id: string;
    baslik: string;
    aciklama: string;
    tamamlandi: boolean;
    oncelik: "dusuk" | "orta" | "yuksek";
}

// Güncelleme için partial kullanımı
function gorevGuncelle(id: string, guncellemeler: Partial<Gorev>): Gorev {
    const mevcutGorev: Gorev = {
        id: id,
        baslik: "Örnek Görev",
        aciklama: "Bu bir örnek görev açıklamasıdır.",
        tamamlandi: false,
        oncelik: "orta"
    };
    return { ...mevcutGorev, ...guncellemeler };
}

gorevGuncelle("1", { tamamlandi: true }); // Sadece tamamlandi'yı güncelle





// 2 -)
// Required<T>
// Tüm property'leri zorunlu yapar.

interface OpsiyonelAyarlar {
    tema?: "acik" | "koyu";
    dil?: string;
    bildirimler?: boolean;
}

type ZorunluAyarlar = Required<OpsiyonelAyarlar>;
// { tema: "acik" | "koyu"; dil: string; bildirimler: boolean }

const zorunluAyarlar: ZorunluAyarlar = {
    tema: "acik",
    dil: "tr",
    bildirimler: true
};

const varsayilanAyarlar: OpsiyonelAyarlar = {
    dil: "tr",
};


// 3 -)
// Pick<T, K>
// Belirli property'leri seçer.

interface Makale {
    id: string;
    baslik: string;
    icerik: string;
    yazar: string;
    yayinTarihi: Date;
    etiketler: string[];
    goruntulemeSayisi: number;
}

// Liste görünümü için sadece özet bilgiler
type MakaleOzeti = Pick<Makale, "id" | "baslik" | "yazar" | "yayinTarihi">;

function makaleleriListele(): MakaleOzeti[] {
    const makaleVeritabani: Makale[] = [
        {
            id: "1",
            baslik: "TypeScript Utility Types",
            icerik: "TypeScript'te utility types kullanımı...",
            yazar: "Mehmet Kirmizikaya",
            yayinTarihi: new Date("2024-01-15"),
            etiketler: ["TypeScript", "Programming", "Utility Types"],
            goruntulemeSayisi: 1500
        }];


    // Sadece gerekli alanları döndür
    return makaleVeritabani.map(m => ({
        id: m.id,
        baslik: m.baslik,
        yazar: m.yazar,
        yayinTarihi: m.yayinTarihi

    }));
}

// 4 -)
// Omit<T, K>
// Belirli property'leri hariç tutar.

// Oluşturma için id ve tarih gerekmez
type YeniMakale = Omit<Makale, "id" | "yayinTarihi" | "goruntulemeSayisi">;

const yeniMakale: YeniMakale = {
    baslik: "Yeni Makale Başlığı",
    icerik: "Bu makalenin içeriği...",
    yazar: "Ayşe Demir",
    etiketler: ["Yeni", "Makale"]
};


// 5 -)
// Record<K, T>
// Belirli anahtar türleri için bir nesne oluşturur. Yani Key-value çiftleri için tip oluşturur.
type Kategori = "teknoloji" | "saglik" | "egitim";

interface KategoriDetay {
    isim: string;
    aciklama: string;
}

const kategoriBilgileri: Record<Kategori, KategoriDetay> = {
    teknoloji: {
        isim: "Teknoloji",
        aciklama: "Teknoloji ile ilgili makaleler."
    },
    saglik: {
        isim: "Sağlık",
        aciklama: "Sağlık ve yaşam ile ilgili makaleler."
    },
    egitim: {
        isim: "Eğitim",
        aciklama: "Eğitim konularında makaleler."
    }
};

// veya başka bir örnek
// Dil çevirileri
type DesteklenenDiller = "tr" | "en" | "de" | "fr";

type Ceviriler = Record<DesteklenenDiller, string>;

const selamlama: Ceviriler = {
    tr: "Merhaba",
    en: "Hello",
    de: "Hallo",
    fr: "Bonjour"
};


// 6-)
// Exclude<T, U> ve Extract<T, U>
// Union type'lardan tip çıkarma ve seçme.

type TumOlaylar = "click" | "scroll" | "keydown" | "keyup" | "mousemove" | "mouseenter" | "mouseleave";

// Mouse olaylarını çıkar
type KlavyeOlaylari = Exclude<TumOlaylar, "click" | "scroll" | "mousemove" | "mouseenter" | "mouseleave">;
// "keydown" | "keyup"

// Mouse olaylarını seç
type MouseOlaylari = Extract<TumOlaylar, "click" | "mousemove" | "mouseenter" | "mouseleave">;
// "click" | "mousemove" | "mouseenter" | "mouseleave"

// Örnek kullanım
let klavyeOlayi: KlavyeOlaylari = "keydown";
let mouseOlayi: MouseOlaylari = "click"



// 7 -)
// ReturnType<T> ve Parameters<T>
// Fonksiyon tiplerinden bilgi çıkarma.
function kullaniciOlustur(ad: string, email: string, yas: number) {
    return {
        id: crypto.randomUUID(),
        ad,
        email,
        yas,
        kayitTarihi: new Date()
    };
}

// Fonksiyonun dönüş tipini al
type OlusturulanKullanici = ReturnType<typeof kullaniciOlustur>;
// { id: string; ad: string; email: string; yas: number; kayitTarihi: Date }

// Fonksiyonun parametre tiplerini al
type KullaniciParametreleri = Parameters<typeof kullaniciOlustur>;
// [ad: string, email: string, yas: number]


export default function UtilityTypesPage() {

    return (
        <div>
            <h1>TypeScript Utility Types Örnekleri</h1>
            <p>Bu sayfada TypeScript'in çeşitli utility type'larının kullanımı gösterilmektedir.</p>
        </div>
    );
}   


