import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "company_head" | "admin" | "seller" | "customer";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  aadhaarNumber?: string;
  role: UserRole;
  parentId?: string;
  companyId?: string;
  isActive: boolean;
  kycStatus?: "pending" | "approved" | "rejected";
  kycDocuments?: string[];
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  aadhaarNumber: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: ["company_head", "admin", "seller", "customer"],
    required: true
  },
  parentId: { type: String, index: true },
  companyId: { type: String, index: true },
  isActive: { type: Boolean, default: true },
  kycStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  kycDocuments: [{ type: String }],
  bankDetails: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
