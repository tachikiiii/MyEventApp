"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";



export default function HeaderImage() {
  const pathname = usePathname();
  // /eventDetail ルートの場合、ヘッダー画像は表示しない
  if (pathname.startsWith("/eventDetail")) {
    return null;
  }
  return (
    <header className="header-container">
      <Image src="/header.png" alt="Header Image" className="header-image" width={500} height={500} />
    </header>
  );
}
