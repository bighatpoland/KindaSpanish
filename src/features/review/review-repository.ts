import type { ReviewItem } from "@/entities/domain";

export interface ReviewRepository {
  listItems: (userId?: string) => Promise<ReviewItem[]>;
  saveItems: (items: ReviewItem[], userId?: string) => Promise<void>;
}
