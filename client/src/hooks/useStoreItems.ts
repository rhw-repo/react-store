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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/items`);
      if (!res.ok) throw new Error(`GET /items failed: ${res.status}`);
      return res.json();
    },
  });
}
