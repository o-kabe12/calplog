import Link from "next/link";

export default function Header() {
  return (
    <header className="">
      <div className="flex items-center justify-between p-4 h-[50px] shadow-sm">
        <Link className="font-bold text-gray-800 hover:opacity-70 transition duration-300 ease-in-out" href="/">CalPlog</Link>
        <Link
          className="font-bold text-gray-800 bg-blue-500 hover:bg-blue-400 text-white py-1 px-4 rounded transition duration-300 ease-in-out"
          href="/login/"
        >
          ログイン
        </Link>
      </div>
    </header>
  );
}