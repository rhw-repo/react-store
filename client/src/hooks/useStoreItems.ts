import { useQuery } from "@tanstack/react-query";

export type StoreItem = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

export function useStoreItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: async (): Promise<StoreItem[]> => {
      const res = await fetch("http://localhost:4000/items");
      if (!res.ok) throw new Error(`GET /items failed: ${res.status}`);
      return res.json();
    },
  });
}
