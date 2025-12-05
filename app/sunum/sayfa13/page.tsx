"use client"

import { Entity, User, Product, Order } from "./types/entities";

interface EntityCardProps<T extends Entity> {
    entity: T;
    renderDetails: (entity: T) => React.ReactNode;
    onDelete: (id: string) => void;
}

const EntityCard = <T extends Entity>({
    entity,
    renderDetails,
    onDelete
}: EntityCardProps<T>) => {
    return (
        <div className="card border rounded-lg p-4 shadow-md">
            {/* Ortak Entity özellikleri */}
            <div className="header flex justify-between items-center mb-4">
                <span className="id font-mono text-sm text-gray-600">#{entity.id}</span>
                <button 
                    onClick={() => onDelete(entity.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                >
                    🗑️
                </button>
            </div>

            <div className="timestamps text-xs text-gray-500 mb-4 space-y-1">
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

const App = () => {
    const users: User[] = [
        {
            id: 'u1',
            username: 'ahmet_yilmaz',
            email: 'ahmet@example.com',
            role: 'admin',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-12-01')
        },
        {
            id: 'u2',
            username: 'ayse_demir',
            email: 'ayse@example.com',
            role: 'user',
            createdAt: new Date('2024-02-10'),
            updatedAt: new Date('2024-11-28')
        },
        {
            id: 'u3',
            username: 'mehmet_kaya',
            email: 'mehmet@example.com',
            role: 'guest',
            createdAt: new Date('2024-03-05'),
            updatedAt: new Date('2024-12-03')
        }
    ];

    const products: Product[] = [
        {
            id: 'p1',
            name: 'Laptop',
            price: 15000,
            stock: 25,
            category: 'Elektronik',
            createdAt: new Date('2024-03-20'),
            updatedAt: new Date('2024-11-28')
        },
        {
            id: 'p2',
            name: 'Mouse',
            price: 250,
            stock: 100,
            category: 'Elektronik',
            createdAt: new Date('2024-04-15'),
            updatedAt: new Date('2024-12-01')
        },
        {
            id: 'p3',
            name: 'Klavye',
            price: 800,
            stock: 50,
            category: 'Elektronik',
            createdAt: new Date('2024-05-10'),
            updatedAt: new Date('2024-11-30')
        }
    ];

    const orders: Order[] = [
        {
            id: 'o1',
            userId: 'u1',
            productIds: ['p1', 'p2'],
            totalAmount: 18500,
            status: 'completed',
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01')
        },
        {
            id: 'o2',
            userId: 'u2',
            productIds: ['p3'],
            totalAmount: 800,
            status: 'pending',
            createdAt: new Date('2024-12-02'),
            updatedAt: new Date('2024-12-02')
        },
        {
            id: 'o3',
            userId: 'u3',
            productIds: ['p1', 'p2', 'p3'],
            totalAmount: 16050,
            status: 'cancelled',
            createdAt: new Date('2024-12-03'),
            updatedAt: new Date('2024-12-03')
        }
    ];

    return (
        <div className="container mx-auto max-w-7xl p-8">
            <h1 className="text-3xl font-bold mb-8">Entity Cards</h1>

            {/* Users Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">👥 Kullanıcılar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <EntityCard
                            key={user.id}
                            entity={user}
                            renderDetails={(u) => (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">👤 {u.username}</h3>
                                    <p className="text-gray-600 mb-2">📧 {u.email}</p>
                                    <span className={`inline-block px-3 py-1 rounded text-sm font-semibold
                                        ${u.role === 'admin' ? 'bg-red-100 text-red-800' : 
                                          u.role === 'user' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-gray-100 text-gray-800'}`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            onDelete={(id) => console.log('User silindi:', id)}
                        />
                    ))}
                </div>
            </section>

            {/* Products Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">📦 Ürünler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <EntityCard
                            key={product.id}
                            entity={product}
                            renderDetails={(p) => (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">📦 {p.name}</h3>
                                    <p className="text-lg font-bold text-green-600 mb-2">
                                        💰 {p.price.toLocaleString('tr-TR')} ₺
                                    </p>
                                    <p className="text-gray-600 mb-2">📊 Stok: {p.stock} adet</p>
                                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                                        {p.category}
                                    </span>
                                </div>
                            )}
                            onDelete={(id) => console.log('Product silindi:', id)}
                        />
                    ))}
                </div>
            </section>

            {/* Orders Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">🛒 Siparişler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <EntityCard
                            key={order.id}
                            entity={order}
                            renderDetails={(o) => (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">🛒 Sipariş</h3>
                                    <p className="text-gray-600 mb-1">👤 Müşteri: {o.userId}</p>
                                    <p className="text-lg font-bold text-green-600 mb-1">
                                        💵 Toplam: {o.totalAmount.toLocaleString('tr-TR')} ₺
                                    </p>
                                    <p className="text-gray-600 mb-2">📦 Ürün Sayısı: {o.productIds.length}</p>
                                    <span className={`inline-block px-3 py-1 rounded text-sm font-semibold
                                        ${o.status === 'completed' ? 'bg-green-100 text-green-800' :
                                          o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'}`}>
                                        {o.status === 'completed' ? '✅' : 
                                         o.status === 'pending' ? '⏳' : '❌'}
                                        {' '}{o.status}
                                    </span>
                                </div>
                            )}
                            onDelete={(id) => console.log('Order silindi:', id)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default App;