import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const checkUser = async () => {
  const user = await currentUser();
  console.log(user);

  //Check for current logged in Clerk user
  if (!user) {
    return null;
  }

  //Check if the user is already in database
  const userInDatabase = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  //If user is in database, return user
  if (userInDatabase) {
    return userInDatabase;
  }

  //If user is not in database, create user
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: `${user.imageUrl}`,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};
