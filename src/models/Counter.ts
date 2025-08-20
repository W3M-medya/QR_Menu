import mongoose, { Schema, Document } from 'mongoose';

interface ICounter extends Document {
  name: string;
  seq: number;
}

const CounterSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export default mongoose.model<ICounter>('Counter', CounterSchema);
