export const formatBalance = (balanceRaw: number | null): string => {
  if (balanceRaw === null) {
    return "N/A";
  }
  const balance = (balanceRaw / 1000000).toLocaleString("en-US");
  return `${balance} t₳`;
};
