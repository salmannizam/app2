// services/dateUtils.ts

export const getCurrentDateTime = () => {
    const now = new Date();
  
    // Get the individual components of the date
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    // Format the values
    const date = `${year}${month}${day}`;
    const time = `${hours}${minutes}${seconds}`;
    const fullDateTime = `${date}${time}`;
  
    return {
        date: date,
      time: time,
      FullDateTime: fullDateTime,
    };
  };
  