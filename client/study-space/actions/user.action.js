"use server";

import User from "@/modals/user.modal";
import { connectToDB } from "@/database";

export async function createUser(userData) {
  try {
    await connectToDB();
    const existingUser = await User.findOne({ clerkId: userData.clerkId });
    if (existingUser) return existingUser;

    const newUser = await User.create(userData);
    return JSON.parse(JSON.stringify(newUser));
  } catch (err) {
    console.error("Error creating user:", err);
  }
}
