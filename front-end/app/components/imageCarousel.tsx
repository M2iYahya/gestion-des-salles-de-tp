"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { useState } from 'react';

interface ThumbsGalleryProps {
  images?: string;
}

const ThumbsGallery = ({ images }: ThumbsGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const imageUrls = images?.split(',').filter(url => url.trim()) || [];

  if (imageUrls.length === 0) {
    return (
      <div className="w-full h-96 bg-muted flex items-center justify-center rounded-xl">
        <span className="text-muted-foreground">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto group">
      {/* Main Carousel */}
      <Swiper
        loop={imageUrls.length > 1}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs, Navigation]}
        className="mb-4 rounded-xl"
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="relative aspect-video">
              <img
                src={`http://localhost:8089${url.trim()}`}
                alt={`Main view ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                {index + 1}/{imageUrls.length}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbs Carousel */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={imageUrls.length > 1}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Thumbs, FreeMode]}
        className="thumbs-carousel"
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="relative aspect-video cursor-pointer transition-opacity hover:opacity-100">
              <img
                src={`http://localhost:8089${url.trim()}`}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border-2 border-transparent transition-all"
              />
              <div className="absolute inset-0 bg-black/30 rounded-lg transition-all" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .thumbs-carousel .swiper-slide-thumb-active {
          opacity: 1 !important;
        }
        .thumbs-carousel .swiper-slide-thumb-active img {
          border-color: hsl(var(--primary)) !important;
        }
        .thumbs-carousel .swiper-slide {
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ThumbsGallery;
