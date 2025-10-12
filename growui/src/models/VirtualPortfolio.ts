import mongoose, { Schema } from "mongoose";

export interface IVirtualSIP {
  userId: string;
  externalFundId: string;
  sipAmount: number;
  startDate: string;
  frequency: "monthly" | "weekly" | "one-time";
  unitsBought?: number;
  transactions?: { date: string; amount: number; units: number }[];
  createdAt?: Date;
}

const TransactionSchema = new Schema(
  {
    date: { type: String, required: true },
    amount: Number,
    units: Number,
  },
  { _id: false }
);

const VirtualPortfolioSchema = new Schema<IVirtualSIP>(
  {
    userId: { type: String, required: true, index: true },
    externalFundId: { type: String, required: true },
    sipAmount: { type: Number, required: true },
    startDate: { type: String, required: true },
    frequency: { type: String, default: "monthly" },
    transactions: { type: [TransactionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.VirtualPortfolio ||
  mongoose.model("VirtualPortfolio", VirtualPortfolioSchema);
