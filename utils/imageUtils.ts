
/**
 * Converts various Google Drive sharing URLs into a direct, embeddable image link
 * that is more reliable and bypasses the "virus scan" intermediate page.
 * 
 * It extracts the file ID and uses the `thumbnail` endpoint which can serve full-size images.
 * 
 * If the URL is not a recognized Google Drive link, it returns the original URL.
 * @param url The Google Drive sharing URL.
 * @returns A direct image link or the original URL.
 */
export const convertGoogleDriveUrl = (url: string | undefined): string => {
  if (!url) {
    // Return a consistent placeholder if URL is missing
    return 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1754002157/placeholder_image_alt_z02erk.jpg'; 
  }

  // Regex to capture file ID from various Google Drive URL formats.
  // Handles: /file/d/ID, /open?id=ID, /uc?id=ID
  const regex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]{25,})/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    const fileId = match[1];
    // Use the thumbnail endpoint which is more reliable for direct embedding and can serve large images.
    // &sz=w1200 sets the target width, preserving aspect ratio.
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  }
  
  // Return the original URL if it's not a recognized Google Drive file link.
  return url;
};
