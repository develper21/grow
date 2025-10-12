import mongoose, { Schema } from "mongoose";

export interface IWatchItem {
  userId: string;
  externalFundId: string;
  note?: string;
  createdAt?: Date;
}

const WatchlistSchema = new Schema<IWatchItem>(
  {
    userId: { type: String, required: true, index: true },
    externalFundId: { type: String, required: true },
    note: String,
  },
  { timestamps: true }
);

export default mongoose.models.Watchlist || mongoose.model("Watchlist", WatchlistSchema);
