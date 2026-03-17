import type { ReviewItem } from "@/entities/domain";

export interface ReviewRepository {
  listItems: () => ReviewItem[];
  saveItems: (items: ReviewItem[]) => void;
}
