import Link from "next/link";

function ProductCard({ product }) {
  const {
    id,
    image,
    title,
    category,
    description,
    price,
    rating,
  } = product;

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <Link
        href={`/products/${id}`}
        className="flex h-48 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-4"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs capitalize text-gray-500">
          {category}
        </p>

        <Link href={`/products/${id}`}>
          <h2 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold leading-6 text-gray-900 hover:text-gray-600">
            {title}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-3 text-sm leading-5 text-gray-500">
          {description}
        </p>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-amber-500">★</span>
          <span className="font-medium text-gray-800">
            {rating.rate}
          </span>
          <span className="text-gray-400">
            ({rating.count} reviews)
          </span>
        </div>

        {/* Price and Button */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
          <span className="text-xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>

          <button
            type="button"
            className="shrink-0 rounded-full bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;