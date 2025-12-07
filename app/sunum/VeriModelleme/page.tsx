// Interface kullanımı (Nesne modelleme)
interface Author {
    readonly id: number; // ID asla değişmemeli
    name: string;
    email: string;
}

// Object Array
const authors: Author[] = [
    { id: 1, name: "Ahmet", email: "ahmet@example.com" },
    { id: 2, name: "Ayşe", email: "ayse@example.com" }
];

// authors[0].id = 5; // HATA! 'id' readonly'dir.



const index = () => {
    return (
        <div>
            <h1>Veri Modelleme - Interface Kullanımı</h1>
            <ul>
                {authors.map((author) => (
                    <li key={author.id}>
                        {author.name} - {author.email}
                    </li>
                ))}   
            </ul>
        </div>
    );
}

export default index;
