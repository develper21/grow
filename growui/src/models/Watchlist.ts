import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWatchlistItem extends Document {
  userId: string;
  schemeCode: string;
  addedAt: Date;
  note?: string;
}

const WatchlistSchema = new Schema<IWatchlistItem>({
  userId: { type: String, required: true, index: true },
  schemeCode: { type: String, required: true, index: true },
  addedAt: { type: Date, default: Date.now },
  note: { type: String },
});

export const Watchlist: Model<IWatchlistItem> =
  (mongoose.models.Watchlist as Model<IWatchlistItem>) ||
  mongoose.model<IWatchlistItem>("Watchlist", WatchlistSchema);
