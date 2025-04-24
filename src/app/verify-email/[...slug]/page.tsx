"use client";

import { useEffect } from "react";

import Loading from "@/shared/components/Loading";
import useStore from "@/shared/store";
import { usePathname, useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const { verifyEmail } = useStore();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const [id, hash] = pathname.split("/").slice(2);
    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    if (id && hash && expires && signature) {
      verifyEmail({
        id,
        hash,
        expires,
        signature,
      }).finally(() => (window.location.href = "/guides"));
    }
  }, [verifyEmail]);

  return <Loading />;
}
