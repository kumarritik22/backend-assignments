import Link from "next/link";
import { Card, CardContent, CardFooter} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function ProductCard({ product }) {
  const { id, image, title, category, description, price, rating } = product;

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <Link
        href={`/products/${id}`}
        className="relative flex h-48 shrink-0 items-center justify-center bg-muted/50 p-5"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Product Details */}
      <CardContent className="flex flex-1 flex-col p-4">
        <div>
          <Badge variant="secondary" className="capitalize">
            {category}
          </Badge>

          <Link href={`/products/${id}`}>
            <h2 className="mt-3 line-clamp-2 min-h-12 text-base font-semibold leading-6 hover:underline">
              {title}
            </h2>
          </Link>

          <p className="mt-2 line-clamp-3 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-amber-500" aria-hidden="true">
            ★
          </span>

          <span className="font-medium">{rating.rate}</span>

          <span className="text-muted-foreground">
            ({rating.count} reviews)
          </span>
        </div>

        <Separator className="my-4" />

        {/* Price and Button */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-xl font-bold">
            ${price.toFixed(2)}
          </span>

          <Button className="rounded-full" type="button">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;