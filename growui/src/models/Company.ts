import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommissionSlab {
  minAmount: number;
  maxAmount: number;
  rate: number;
  description: string;
}

export interface ICompany extends Document {
  name: string;
  headId: string;
  commissionSlabs: ICommissionSlab[];
  settings: {
    annualCommissionRate: number;
    monthlyPayoutDay: number;
    minWithdrawalAmount: number;
    maxWithdrawalAmount: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommissionSlabSchema = new Schema<ICommissionSlab>({
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  rate: { type: Number, required: true, min: 0, max: 100 },
  description: { type: String, required: true }
});

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  headId: { type: String, required: true, index: true },
  commissionSlabs: { type: [CommissionSlabSchema], default: [] },
  settings: {
    annualCommissionRate: { type: Number, default: 2.0 },
    monthlyPayoutDay: { type: Number, default: 5 },
    minWithdrawalAmount: { type: Number, default: 100 },
    maxWithdrawalAmount: { type: Number, default: 100000 }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Company: Model<ICompany> = (mongoose.models.Company as Model<ICompany>) || mongoose.model<ICompany>("Company", CompanySchema);
