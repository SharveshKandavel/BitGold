import { query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    // Return some mock data for now
    return [
      { _id: "1", type: "buy", amount: 0.1, price: 200, date: new Date().toISOString() },
      { _id: "2", type: "sell", amount: 0.05, price: 105, date: new Date().toISOString() },
      { _id: "3", type: "buy", amount: 0.02, price: 40, date: new Date().toISOString() },
    ];
  },
});
