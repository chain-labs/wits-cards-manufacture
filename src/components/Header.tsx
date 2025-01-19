import { IMAGEKIT_LOGO } from "@/images";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className={cn(
        "fixed top-0 left-0",
        "bg-[linear-gradient(to_right,#FFFED000,#FFFED00D_90%)]",
        "flex flex-col justify-between items-center",
        "mt-[48px] rounded-[6px] z-50 backdrop-blur-sm max-w-[1200px] mx-auto",
      )}
    >
      <Link
        href={"/"}
        className="flex justify-center items-center gap-[8px] uppercase text-lightGold"
      >
        <Image
          src={IMAGEKIT_LOGO.WITS_LOGO}
          alt="WITS Logo"
          width={168}
          height={97}
          className="w-[100px] h-auto object-cover scale-[1.2]"
        />
      </Link>
    </header>
  );
}
