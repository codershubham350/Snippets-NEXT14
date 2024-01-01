"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { redirect } from "next/navigation";

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  try {
    // Check the user's inputs and make sure they're valid
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 3) {
      return {
        message: "Title must be longer",
      };
    }

    if (typeof code !== "string" || code.length < 10) {
      return {
        message: "Code must be longer",
      };
    }

    // Create a new record in database
    await db.snippet.create({
      data: {
        title,
        code,
      },
    });
    // throw new Error("Failed to save to database!!!");
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: err.message,
      };
    } else {
      return {
        message: "Something went wrong!",
      };
    }
  }

  revalidatePath("/"); // revalidatePath will revalidate the page(for whose route is mentioned, here it is homePage) whenever user here performs 'create' action

  // Redirect the user back to root route
  // do not put redirect('/') inside try catch block as it will catch it as an error.
  redirect("/");
}

export async function editSnippet(id: number, code: string) {
  //console.log("edit snippet called", id, code);
  await db.snippet.update({
    where: {
      id,
    },
    data: { code },
  });

  revalidatePath(`/snippets/${id}`); // revalidatePath will revalidate the page(for whose route is mentioned, here it is specific ID) whenever user here performs 'edit' action
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: { id },
  });

  revalidatePath("/"); // revalidatePath will revalidate the page(for whose route is mentioned, here it is homePage) whenever user here performs 'delete' action
  redirect("/");
}
