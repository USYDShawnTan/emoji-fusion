export type Emoji = {
  id: string;
  symbol: string;
  name: string;
};

export type FusionResult = {
  fusedEmoji: string;
  apiResponse: any; // You can replace 'any' with a more specific type based on your API response structure
};