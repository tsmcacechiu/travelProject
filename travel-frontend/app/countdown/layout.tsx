import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "生命倒數計時表",
  description: "還剩下多少時間？一個關於時間的極簡工具。",
};

export default function CountdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {children}
      <div className="fixed bottom-6 right-6">
        <Link
          href="/"
          className="text-xs tracking-widest text-white/20 uppercase transition-colors hover:text-white/60"
        >
          ← 返回主站
        </Link>
      </div>
    </div>
  );
}
