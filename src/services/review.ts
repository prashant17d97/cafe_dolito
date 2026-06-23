import { REVIEWS } from "@/mocks/reviews";
import { withDelay } from "./delay";

export const reviewService = {
  list: (itemSlug?: string) =>
    withDelay(itemSlug ? REVIEWS.filter((r) => r.itemSlug === itemSlug) : REVIEWS),
};
