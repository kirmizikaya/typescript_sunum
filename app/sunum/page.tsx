"use client"

// Multiple generic types
interface SelectProps<T, K extends keyof T> {
  items: T[];
  valueKey: K;
  labelKey: K;
  onSelect: (value: T[K]) => void;
}

const Select = <T, K extends keyof T>({
  items,
  valueKey,
  labelKey,
  onSelect
}: SelectProps<T, K>) => {
  return (
    <select onChange={(e) => {
      const selected = items.find(
        item => String(item[valueKey]) === e.target.value
      );
      if (selected) onSelect(selected[valueKey]);
    }}>
      {items.map((item, index) => (
        <option key={index} value={String(item[valueKey])}>
          {String(item[labelKey])}
        </option>
      ))}
    </select>
  );
};

// Kullanım
interface Product {
  id: number;
  name: string;
  price: number;
}

let products: Product[] = [
  {
    id: 1,
    name: "mehmet",
    price: 123
  },
  {
    id: 2,
    name: "aliveli",
    price: 123.
  }
];

interface User {
  id: number;
  username: string;
  status: boolean;
}

let users: User[] = [
  {
    id: 1,
    status: true,
    username: "kirmizikaya"
  },
  {
    id: 1,
    status: true,
    username: "kirmizikaya"
  }
]



const index = () => {


  return (
    <>
      <Select
        items={
          products
        }
        valueKey="id"     // Otomatik tamamlanır: "id" | "name" | "price"
        labelKey="name"
        onSelect={(id) => console.log(id)}
      />
      <Select
        items={
          users
        }
        valueKey="id"
        labelKey="username"
        onSelect={(id) => console.log(id)}
      />
    </>
  );
};

export default index;