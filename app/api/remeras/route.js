import { dbConnect } from '@/lib/mongodb';
import Remera from '@/models/Remera';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const remeras = await Remera.find({});
  return NextResponse.json(remeras);
}