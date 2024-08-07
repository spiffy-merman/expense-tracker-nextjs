"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface TransactionData {
  text: string;
  amount: number;
}

interface TransactionResult {
  data?: TransactionData;
  error?: string;
}

async function addTransaction(formData: FormData): Promise<TransactionResult> {
  const textValue = formData.get("text");
  const amountValue = formData.get("amount");

  //Check for input values
  if (!textValue || textValue === "" || !amountValue) {
    return { error: "Text or amount is missing" };
  }

  const text: string = textValue.toString(); //Ensures text is a string

  const amount: number = parseFloat(amountValue.toString()); //Parse amount as number

  //Get logged in user
  const { userId } = await auth();

  //Check for user
  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const TransactionData: TransactionData = await db.transaction.create({
      data: {
        text,
        amount,
        userId,
      },
    });

    return { data: TransactionData };

    revalidatePath("/");
  } catch (error) {
    return { error: "Error adding transaction" };
  }
}

export default addTransaction;
