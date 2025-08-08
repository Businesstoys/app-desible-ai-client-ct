
/**
 * Converts a MongoDB ISO date string into the format 'YYYY-MM-DD HH:mm:ss'.
 * @param {string} mongoDate - The MongoDB ISO date string.
 * @returns {string} - The formatted date string in 'YYYY-MM-DD HH:mm:ss' format.
 */
export const formatMongoDate = (data) => {
    if (!data) return '';
  
    const jsDate = new Date(data);
  
    const year = jsDate.getFullYear();
    const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
    const day = jsDate.getDate().toString().padStart(2, '0');
    const hours = jsDate.getHours().toString().padStart(2, '0');
    const minutes = jsDate.getMinutes().toString().padStart(2, '0');
    const seconds = jsDate.getSeconds().toString().padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  