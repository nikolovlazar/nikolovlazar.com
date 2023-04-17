export const getFormattedDate = (date: Date) => {
  return date.toLocaleString("en-ca", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
