import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavPoint {
  date: Date;
  nav: number;
}

export interface IFund extends Document {
  schemeCode: string; 
  name: string;
  category?: string;
  isActive: boolean;
  currentNAV?: number;
  currentNAVDate?: Date;
  navHistory: INavPoint[]; 
  updatedAt: Date;
}

const NavPointSchema = new Schema<INavPoint>({
  date: { type: Date, required: true },
  nav: { type: Number, required: true },
});

const FundSchema = new Schema<IFund>({
  schemeCode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String },
  isActive: { type: Boolean, required: true, default: true },
  currentNAV: { type: Number },
  currentNAVDate: { type: Date },
  navHistory: { type: [NavPointSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export const Fund: Model<IFund> = (mongoose.models.Fund as Model<IFund>) || mongoose.model<IFund>("Fund", FundSchema);
