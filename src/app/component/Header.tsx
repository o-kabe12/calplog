import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <header className="h-[60px] bg-white border-b border-gray-100">
      <div className="w-full h-full flex items-center justify-between max-w-[1200px] mx-auto px-6">
        <Link className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200" href="/">CalPlog</Link>
        {session ? (
          pathname === "/mypage" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              ログアウト
            </button>
          ) : (
            <Link href="/mypage/" className="flex items-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-800 transition-colors duration-200">
              <span>
                <Image src="/icon-user.svg" alt="User Icon"  width={20} height={20}/>
              </span>
              <span>マイページ</span>
            </Link>
          )
        ) : (
          <Link
            className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            href="/login/"
          >
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
}