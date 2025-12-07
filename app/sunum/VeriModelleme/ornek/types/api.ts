export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};


/* generic utility
✔ entity değil, wrapper
✔ bu yüzden type daha doğru

*/