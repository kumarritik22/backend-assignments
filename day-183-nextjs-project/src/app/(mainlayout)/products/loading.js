import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          className="flex h-full min-h-110 flex-col overflow-hidden rounded-2xl"
        >
          {/* Product Image */}
          <Skeleton className="h-48 w-full shrink-0 rounded-none" />

          <CardContent className="flex flex-1 flex-col p-4">
            {/* Category Badge */}
            <Skeleton className="h-5 w-24 rounded-full" />

            {/* Product Title */}
            <div className="mt-3 min-h-12 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Description */}
            <div className="mt-2 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-20" />
            </div>

            {/* Divider */}
            <Separator className="my-4" />

            {/* Price and Add to Cart Button */}
            <div className="mt-auto flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}