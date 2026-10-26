import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex h-full min-h-110 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          {/* Product Image */}
          <Skeleton className="h-48 w-full shrink-0 rounded-xl" />

          {/* Product Details */}
          <div className="flex flex-1 flex-col pt-4">
            <Skeleton className="h-3 w-24" />

            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="mt-3 space-y-2">
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

            {/* Price and Button */}
            <div className="mt-auto flex items-center justify-between gap-2 pt-5">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}