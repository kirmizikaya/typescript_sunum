// /Bu .tsx dosyasında HATA VERİR!
// const List = <T>({ items }: { items: T[] }) => {
//   return <div>...</div>;
// };

// // TypeScript/JSX parser şunu görür:
// // <T>  ← Bu bir JSX tag mi yoksa generic mi?
// // </div> ← Kapanış tag'i nerede?


{/* 
<T>              ← JSX opening tag olarak yorumlar
({ items }...    ← Tag içeriği olarak görür
</div>           ← Ama <T> için </T> kapanış tag'i yok!
```

### **Hata Mesajı:**
```
JSX element 'T' has no corresponding closing tag.
```

veya
```
'>' expected. 
*/}



// ÇÖZÜM 1

const List = <T extends {}>({ items }: { items: T[] }) => {
  return <div>...</div>;
};

// ÇÖZÜM 2 
const Sayfa12 = <T,>({ items }: { items: T[] }) => {
  return <div>
    render text
  </div>;
};

export default Sayfa12;




//// Not: Aşağıdaki kodlar sadece örnej amaçlıdır. Yukarıdaki kodun parçası değildir.

// Interface extension
interface Canli {
    yasıyor: boolean;
    yas: number;
}

interface Hayvan extends Canli {
    tur: string;
    beslenme: "otobur" | "etobur" | "hepciyor";
}

interface Memeli extends Hayvan {
    kanSicakligi: "sicakKanli" | "soğukKanli";
    emzirme: boolean;
}

// Çoklu interface extension
interface Ucabilen {
    kanatAcikligi: number;
    ucabilir: true;
}

interface Kus extends Memeli, Ucabilen {
    tuyRengi: string;
}

const kartal: Kus = {
    yasıyor: true,
    yas: 5,
    tur: "Kartal",
    beslenme: "etobur",
    kanatAcikligi: 200,
    ucabilir: true,
    tuyRengi: "kahverengi",
    kanSicakligi: "soğukKanli",
    emzirme: true
};


//Type Intersection ile Birleştirme
// Type intersection (&) ile birleştirme
type Kimlik = {
    id: string;
    olusturulmaTarihi: Date;
};

type KisiselBilgi = {
    ad: string;
    soyad: string;
    dogumTarihi: Date;
};

type IletisimBilgisi = {
    email: string;
    telefon: string;
    adres?: string;
};

// Tüm tipleri birleştir
type TamKullanici = Kimlik & KisiselBilgi & IletisimBilgisi;

const kullanici: TamKullanici = {
    id: "usr-123",
    olusturulmaTarihi: new Date(),
    ad: "Mehmet",
    soyad: "Yıldız",
    dogumTarihi: new Date("1990-05-15"),
    email: "mehmet@example.com",
    telefon: "5551234567"
};


