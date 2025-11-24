"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, SignedIn, SignedOut} from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { FiBell } from "react-icons/fi";

export const Navigation = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const firstName = user.firstName;

  return (
    <nav className="centerLinks">
      <SignedOut>
        <SignInButton mode = "modal" />
      </SignedOut>
      <SignedIn>
        <FiBell 
          size={25}
          color="white"
        />
        <p>{firstName}</p>
      
        <UserButton
        appearance={{
          elements: {
            avatarBox: {
              width: "35px",
              height: "35px",
            },
          },
        }}
        />
      </SignedIn>
    </nav>
  );
};
