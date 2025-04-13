export const getFirstImage = (imageString?: string) => {
    if (!imageString) return undefined;
    const images = imageString.split(',');
    return images.length > 0 ? images[0] : undefined;
};