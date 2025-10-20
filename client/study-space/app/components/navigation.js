"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, SignedIn, SignedOut} from "@clerk/nextjs";

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="centerLinks">
      <Link
        href="/"
        className={pathname === "/" ? "currentLink" : "notCurrentLink"}
      >
        Home
      </Link>

      <SignedOut>
        <SignInButton mode = "modal" />
      </SignedOut>
      <SignedIn>
      <Link
        href="/create"
        className={pathname === "/create" ? "currentLink" : "notCurrentLink"}
      >
        Create
      </Link>

      <Link
        href="/history"
        className={pathname === "/history" ? "currentLink" : "notCurrentLink"}
      >
        History
      </Link>

        <UserButton />
      </SignedIn>
    </nav>
  );
};
