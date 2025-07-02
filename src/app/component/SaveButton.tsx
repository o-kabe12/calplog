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
    const today = new Date().toISOString().slice(0, 10);
    try {
      await setDoc(
        doc(db, "users", session.user.email, "records", today),
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
    <>
      {!session ? (
        <Link
          href="/login"
          className="block w-fit mt-4 mx-auto bg-blue-600 text-white rounded px-4 py-2 hover:opacity-70 cursor-pointer transition duration-300 ease-in-out"
        >
          ログインして結果を保存
        </Link>
      ) : (
      <button
        onClick={handleSave}
        className="block mt-4 mx-auto bg-blue-600 text-white rounded px-4 py-2 hover:opacity-70 cursor-pointer transition duration-300 ease-in-out"
      >
        本日の結果を保存
      </button>
      )}
    </>
  );
}
