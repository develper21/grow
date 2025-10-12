import mongoose, { Schema, model, models, Document } from "mongoose";

export interface INavPoint {
  date: string;
  nav: number;
}

export interface IFund extends Document {
  externalId: string;
  name: string;
  category?: string;
  schemeCode?: string;
  active: boolean;
  latestNav?: number;
  latestNavDate?: string;
  navHistory: { date: string; nav: number }[];
  metadata?: Record<string, any>;
}

const NavPointSchema = new Schema(
  {
    date: { type: String, required: true },
    nav: { type: Number, required: true },
  },
  { _id: false }
);

const FundSchema = new Schema<IFund>({
  externalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  schemeCode: { type: String },
  active: { type: Boolean, default: true },
  latestNav: { type: Number },
  latestNavDate: { type: String },
  navHistory: [
    {
      date: { type: String },
      nav: { type: Number },
    },
  ],
  metadata: { type: Schema.Types.Mixed },
});

const Fund = models.Fund || model<IFund>("Fund", FundSchema);
export default Fund;