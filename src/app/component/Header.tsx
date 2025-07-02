import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <header className="h-[50px] shadow-sm flex items-center">
      <div className="w-full flex items-center justify-between max-w-[1200px] mx-auto px-4">
        <Link className="font-bold text-gray-800 hover:opacity-70 transition duration-300 ease-in-out" href="/">CalPlog</Link>
        {session ? (
          pathname === "/mypage" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="font-bold text-gray-800 bg-red-500 hover:bg-red-400 text-white py-1 px-4 rounded cursor-pointer transition duration-300 ease-in-out"
            >
              ログアウト
            </button>
          ) : (
            <Link href="/mypage/" className="flex items-center gap-2">
              <span className="font-bold text-gray-800">マイページ</span>
            </Link>
          )
        ) : (
          <Link
            className="font-bold text-gray-800 bg-blue-500 hover:bg-blue-400 text-white py-1 px-4 rounded transition duration-300 ease-in-out"
            href="/login/"
          >
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
}