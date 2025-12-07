 //ListingListResponse type

import { ApiResponse } from "./../types/api";
import { Paginated } from "./../types/pagination";
import { Listing } from "./../models/listing";

export type ListingListResponse = ApiResponse<Paginated<Listing>>;


// type → çünkü bu bir "composed type"



/* 
Bu şekide de yazılabilir: 
export type ListingListResponse = ApiResponse<{
  items: Listing[];
} & Pagination>;

Burada:

{ items: Listing[] }

& Pagination

→ Intersection ile birleştiriliyor.


✔ Avantajları

Ekstra type tanımlamadan hızlı çözüm

Sadece Listeleme için kullanıyorsan daha pratik

✖ Dezavantajları

Reusable değildir

Başka modellerde tekrar pagination kullanacaksan duplicate oluşur

Kod büyüdükçe kalabalık ve dağınık durur


*/
