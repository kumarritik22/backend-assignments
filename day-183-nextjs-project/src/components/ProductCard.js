function ProductCard({ product }) {
  const { image, title, category, description, price, rating } = product;

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-52 items-center justify-center">
        <img
          src={image}
          alt={title}
          className="h-full max-w-full object-contain"
        />
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-sm capitalize text-gray-500">
          {category}
        </p>

        <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <p className="line-clamp-3 text-sm text-gray-600">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>

          <div className="text-right">
            <p className="font-medium text-amber-500">
              ★ {rating.rate}/5
            </p>
            <p className="text-xs text-gray-500">
              {rating.count} ratings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;