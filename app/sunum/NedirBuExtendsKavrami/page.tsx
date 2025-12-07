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

