"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ProductImage {
  _key: string | null;
  asset: {
    _id: string;
    url: string | null;
    metadata: {
      dimensions: {
        width: number | null;
        height: number | null;
      } | null;
    } | null;
  } | null;
  hotspot: {
    x?: number;
    y?: number;
  } | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const validImages = images.filter((img) => img.asset?.url);

  if (validImages.length === 0) {
    return (
      <div className="aspect-[4/5] bg-secondary flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const currentImage = validImages[selectedIndex];

  // Prepare slides for lightbox
  const slides = validImages.map((img) => ({
    src: img.asset?.url ?? "",
    alt: productName,
    width: img.asset?.metadata?.dimensions?.width ?? 1200,
    height: img.asset?.metadata?.dimensions?.height ?? 1500,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="aspect-[4/5] relative overflow-hidden bg-secondary cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
      >
        {currentImage?.asset?.url && (
          <Image
            src={currentImage.asset.url}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover"
            style={
              currentImage.hotspot?.x !== undefined &&
              currentImage.hotspot?.y !== undefined
                ? {
                    objectPosition: `${currentImage.hotspot.x * 100}% ${currentImage.hotspot.y * 100}%`,
                  }
                : undefined
            }
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={selectedIndex === 0}
          />
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {validImages.map((image, index) => (
            <button
              key={image._key ?? index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative w-16 h-20 md:w-20 md:h-24 overflow-hidden bg-secondary transition-opacity",
                index === selectedIndex
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-80"
              )}
            >
              {image.asset?.url && (
                <Image
                  src={image.asset.url}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedIndex}
        slides={slides}
        plugins={[Zoom, Thumbnails, Fullscreen]}
        on={{
          view: ({ index }) => setSelectedIndex(index),
        }}
        carousel={{
          finite: true,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        thumbnails={{
          position: "bottom",
          width: 80,
          height: 100,
          gap: 12,
          borderRadius: 0,
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
          thumbnailsContainer: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
        }}
      />
    </div>
  );
}
