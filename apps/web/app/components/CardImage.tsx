"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FILLER = "/photos/5%20Starfish/Full%20Res/5Starfish_FullRes-1.jpg";

export default function CardImage({ slug, alt }: { slug: string; alt: string; cover?: string }) {
  const [src, setSrc] = useState<string>(FILLER);

  useEffect(() => {
    setSrc(FILLER);
  }, [slug]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100 relative">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
        priority={false}
        onError={() => {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.warn("Image failed:", src);
          }
        }}
      />
    </div>
  );
}


