import mongoose, { Schema, Document, Model } from "mongoose";

export type CommissionStatus = "accrued" | "available" | "withdrawn" | "cancelled";

export interface ICommission extends Document {
  period: {
    month: number;
    year: number;
  };
  customerId: string;
  sellerId: string;
  adminId: string;
  companyId: string;
  portfolioValue: number;
  annualRate: number;
  monthlyRate: number;
  totalCommission: number;
  breakdown: {
    company: number;
    admin: number;
    seller: number;
    mutualFund: number;
  };
  status: CommissionStatus;
  withdrawalDate?: Date;
  withdrawnAt?: Date;
  generatedAt: Date;
  metadata?: {
    calculationMethod: string;
    navDate: Date;
    notes?: string;
  };
}

const CommissionSchema = new Schema<ICommission>({
  period: {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2020, max: 2030 }
  },
  customerId: { type: String, required: true, index: true },
  sellerId: { type: String, required: true, index: true },
  adminId: { type: String, required: true, index: true },
  companyId: { type: String, required: true, index: true },
  portfolioValue: { type: Number, required: true, min: 0 },
  annualRate: { type: Number, required: true, min: 0, max: 100 },
  monthlyRate: { type: Number, required: true, min: 0, max: 100 },
  totalCommission: { type: Number, required: true, min: 0 },
  breakdown: {
    company: { type: Number, required: true, min: 0 },
    admin: { type: Number, required: true, min: 0 },
    seller: { type: Number, required: true, min: 0 },
    mutualFund: { type: Number, required: true, min: 0 }
  },
  status: {
    type: String,
    enum: ["accrued", "available", "withdrawn", "cancelled"],
    default: "accrued",
    index: true
  },
  withdrawalDate: { type: Date },
  withdrawnAt: { type: Date },
  generatedAt: { type: Date, default: Date.now, index: true },
  metadata: {
    calculationMethod: { type: String, default: "standard" },
    navDate: { type: Date, required: true },
    notes: { type: String }
  }
});

CommissionSchema.index({ customerId: 1, period: 1 });
CommissionSchema.index({ sellerId: 1, period: 1, status: 1 });
CommissionSchema.index({ adminId: 1, period: 1, status: 1 });
CommissionSchema.index({ companyId: 1, period: 1 });
CommissionSchema.index({ withdrawalDate: 1, status: 1 });

export const Commission: Model<ICommission> = (mongoose.models.Commission as Model<ICommission>) || mongoose.model<ICommission>("Commission", CommissionSchema);
