// src/models/VirtualPortfolio.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVirtualSIP {
  schemeCode: string;
  amount: number;       // amount per installment
  frequency: "monthly" | "quarterly" | "yearly";
  startDate: Date;
  active: boolean;
  createdAt: Date;
}

export interface IVirtualPortfolio extends Document {
  userId: string;
  name: string;
  cash?: number; // virtual cash balance
  sips: IVirtualSIP[];
  createdAt: Date;
  updatedAt: Date;
}

const VirtualSIPSchema = new Schema<IVirtualSIP>({
  schemeCode: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ["monthly", "quarterly", "yearly"], default: "monthly" },
  startDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const VirtualPortfolioSchema = new Schema<IVirtualPortfolio>({
  userId: { type: String, required: true, index: true },
  name: { type: String, default: "My Virtual Portfolio" },
  cash: { type: Number, default: 100000 }, // default virtual money
  sips: { type: [VirtualSIPSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const VirtualPortfolio: Model<IVirtualPortfolio> =
  (mongoose.models.VirtualPortfolio as Model<IVirtualPortfolio>) ||
  mongoose.model<IVirtualPortfolio>("VirtualPortfolio", VirtualPortfolioSchema);
