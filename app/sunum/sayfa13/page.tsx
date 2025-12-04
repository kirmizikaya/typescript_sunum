"use client"
// Base Entity
interface Entity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Spesifik Entity tipleri (Entity'den türeyen)
interface User extends Entity {
    username: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
}

interface Product extends Entity {
    name: string;
    price: number;
    stock: number;
    category: string;
}

interface Order extends Entity {
    userId: string;
    productIds: string[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
}

// 3️⃣ Generic component - Hepsi için çalışır!
const EntityCard = <T extends Entity>({
    entity,
    renderDetails,
    onDelete
}: {
    entity: T;
    renderDetails: (entity: T) => React.ReactNode;
    onDelete: (id: string) => void;
}) => {
    return (
        <div className="card">
            {/* Ortak Entity özellikleri */}
            <div className="header">
                <span className="id">#{entity.id}</span>
                <button onClick={() => onDelete(entity.id)}>🗑️</button>
            </div>

            <div className="timestamps">
                <div>📅 {entity.createdAt.toLocaleDateString('tr-TR')}</div>
                <div>🔄 {entity.updatedAt.toLocaleDateString('tr-TR')}</div>
            </div>

            {/* Her entity'nin kendine özgü detayları */}
            <div className="details">
                {renderDetails(entity)}
            </div>
        </div>
    );
};

// 4️⃣ Kullanım Örnekleri
const App = () => {
    const user: User = {
        id: 'u1',
        username: 'ahmet_yilmaz',
        email: 'ahmet@example.com',
        role: 'admin',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01')
    };

    const product: Product = {
        id: 'p1',
        name: 'Laptop',
        price: 15000,
        stock: 25,
        category: 'Elektronik',
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-11-28')
    };

    const order: Order = {
        id: 'o1',
        userId: 'u1',
        productIds: ['p1', 'p2'],
        totalAmount: 18500,
        status: 'completed',
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
    };

    return (
        <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col sm:flex-row border-1">
                
                <div className="flex justify-center items-center mr-20 border-1">
                    {/* User Card */}
                    <EntityCard
                        entity={user}
                        renderDetails={(u) => (
                            <div>
                                <h3>👤 {u.username}</h3>
                                <p>📧 {u.email}</p>
                                <span className={`role ${u.role}`}>
                                    {u.role.toUpperCase()}
                                </span>
                            </div>
                        )}
                        onDelete={(id) => console.log('User silindi:', id)}
                    />
                </div>
                <div className="flex justify-center items-center mr-20 border">
                    {/* Product Card */}
                    <EntityCard
                        entity={product}
                        renderDetails={(p) => (
                            <div>
                                <h3>📦 {p.name}</h3>
                                <p>💰 {p.price.toLocaleString('tr-TR')} ₺</p>
                                <p>📊 Stok: {p.stock} adet</p>
                                <span className="category">{p.category}</span>
                            </div>
                        )}
                        onDelete={(id) => console.log('Product silindi:', id)}
                    />
                </div>
                <div className="flex justify-center items-center mr-20">
                    {/* Order Card */}
                    <EntityCard
                        entity={order}
                        renderDetails={(o) => (
                            <div>
                                <h3>🛒 Sipariş</h3>
                                <p>👤 Müşteri: {o.userId}</p>
                                <p>💵 Toplam: {o.totalAmount.toLocaleString('tr-TR')} ₺</p>
                                <p>📦 Ürün Sayısı: {o.productIds.length}</p>
                                <span className={`status ${o.status}`}>
                                    {o.status === 'completed' ? '✅' :
                                        o.status === 'pending' ? '⏳' : '❌'}
                                    {o.status}
                                </span>
                            </div>
                        )}
                        onDelete={(id) => console.log('Order silindi:', id)}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;