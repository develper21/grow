import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVirtualSIP {
  schemeCode: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly";
  startDate: Date;
  active: boolean;
  createdAt: Date;
}

export interface IPortfolioHolding {
  schemeCode: string;
  units: number;
  averageNav: number;
  currentNav: number;
  currentValue: number;
  lastUpdated: Date;
}

export interface IVirtualPortfolio extends Document {
  userId: string;
  name: string;
  cash?: number;
  holdings: IPortfolioHolding[];
  sips: IVirtualSIP[];
  totalValue: number; // Current total portfolio value (calculated)
  lastCalculated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioHoldingSchema = new Schema<IPortfolioHolding>({
  schemeCode: { type: String, required: true },
  units: { type: Number, required: true, min: 0 },
  averageNav: { type: Number, required: true, min: 0 },
  currentNav: { type: Number, required: true, min: 0 },
  currentValue: { type: Number, required: true, min: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

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
  cash: { type: Number, default: 100000 },
  holdings: { type: [PortfolioHoldingSchema], default: [] },
  sips: { type: [VirtualSIPSchema], default: [] },
  totalValue: { type: Number, default: 0 },
  lastCalculated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for efficient queries
VirtualPortfolioSchema.index({ userId: 1, lastCalculated: -1 });

export const VirtualPortfolio: Model<IVirtualPortfolio> =
  (mongoose.models.VirtualPortfolio as Model<IVirtualPortfolio>) ||
  mongoose.model<IVirtualPortfolio>("VirtualPortfolio", VirtualPortfolioSchema);
