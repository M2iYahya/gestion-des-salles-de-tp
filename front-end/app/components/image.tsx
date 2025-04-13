"use client"
import React, { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string; // The primary image source
  fallbackSrc: string; // The fallback image source in case of an error
}

const Image: React.FC<ImageProps> = ({ src, alt, className, fallbackSrc, ...props }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? fallbackSrc : src}
      alt={alt || "image"}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default Image;
