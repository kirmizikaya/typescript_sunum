// Base Entity
export interface Entity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Spesifik Entity tipleri (Entity'den türeyen)
export interface User extends Entity {
    username: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
}

export interface Product extends Entity {
    name: string;
    price: number;
    stock: number;
    category: string;
}

export interface Order extends Entity {
    userId: string;
    productIds: string[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
}