import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToEUR } from "@/helpers/money";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
}

const ProductItem = ({ product }: ProductItemProps) => {
  const firstVariant = product.variants[0];

  // Validate and fix the image URL
  const getValidImageUrl = (url: string) => {
    try {
      // If URL doesn't start with http/https, assume it's a relative path
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return url.startsWith("/") ? url : `/${url}`;
      }
      new URL(url); // Validate URL format
      return url;
    } catch {
      // Return a placeholder image if URL is invalid
      return "/placeholder-image.jpg";
    }
  };

  return (
    <Link href="/" className="flex flex-col gap-4">
      <Image
        src={getValidImageUrl(firstVariant.imageUrl)}
        alt={firstVariant.name}
        width={200}
        height={200}
        className="rounded-3xl"
      />
      <div className="flex max-w-[200px] flex-col gap-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          {formatCentsToEUR(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
