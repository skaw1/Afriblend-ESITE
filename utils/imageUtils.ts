
/**
 * Converts a standard Google Drive sharing URL into a direct, embeddable image link.
 * e.g., from: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * to: https://drive.google.com/uc?export=view&id=FILE_ID
 * 
 * If the URL is not a Google Drive link, it returns the original URL.
 * @param url The Google Drive sharing URL.
 * @returns A direct image link or the original URL.
 */
export const convertGoogleDriveUrl = (url: string | undefined): string => {
  if (!url) {
    return 'https://picsum.photos/seed/placeholder/800/800'; // Return a placeholder if URL is undefined
  }

  const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // Return the original URL if it's not a standard Google Drive file link
  return url;
};
