"use server";

import User from "@/modals/user.modal";
import { connectToDB } from "@/database";

export async function createUser({user}){
    try {
        await connectToDB();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    }
    catch (error) {
        console.log(error);
    }
}