"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreatePage() {
  const router = useRouter();
  
  // Redirect to home page since creation is now on the home page
  useEffect(() => {
    router.push("/");
  }, [router]);

  return null;
}