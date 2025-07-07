import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function SaveButton({ result }: { result: { calories: number; protein: number } }) {
  const { data: session } = useSession();

  const handleSave = async () => {
    if (!session?.user?.email) {
      alert("ログインしていません！");
      return;
    }

    const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })//　記録用の日付フォーマット(xx/xx/xx)
    const formattedToday = today.replace(/\//g, "-"); // db用 YYYY-MM-DD形式に変換
    try {
      await setDoc(
        doc(db, "users", session.user.email, "records", formattedToday),
        {
          calories: result.calories,
          protein: result.protein,
          date: today,
        }
      );
      alert("保存しました！");
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    }
  };

  return (
    <div className="mt-8">
      {!session ? (
        <Link
          href="/login"
          className="block w-full max-w-md mx-auto px-6 py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
        >
          ログインして結果を保存
        </Link>
      ) : (
        <button
          onClick={handleSave}
          className="block w-full max-w-md mx-auto px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
        >
          本日の結果を保存
        </button>
      )}
    </div>
  );
}
