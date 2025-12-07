
import { getListings } from "./services/listings.service";

export default async function ListingsPage() {
    const result = await getListings();

  return (
    <div className="container">
      <h1>İlanlar</h1>
      {result.data.items.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.location.city} / {item.location.district}</p>
          <strong>{item.price} TL</strong>
          <hr></hr>
        </div>
      ))}
    </div>
  );
}
