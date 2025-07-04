"use client";
import Header from "../component/Header";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";

type RecordType = {
  date: string;
  calories: number;
  protein: number;
};

export default function Home() {

  const { data: session } = useSession();
  const [records, setRecords] = useState<RecordType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;

      const ref = collection(db, "users", session.user.email, "records");
      const snapshot = await getDocs(ref);

      const data = snapshot.docs.map((doc) => doc.data() as RecordType);
      // 日付の降順でソート
      data.sort((a, b) => b.date.localeCompare(a.date));
      setRecords(data);
    };

    fetchData();
  }, [session]);

  return (
    <>
      <Header />
      <main className="py-8 px-4 max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">こんにちは！<br />マイページへようこそ</h1>
        <p className="text-center">ここでは、あなたのログの記録を確認できます。</p>

        <h2 className="text-xl font-semibold mt-6 mb-10 text-center">保存された記録</h2>
        <ul className="space-y-2">
        {records.map((record) => (
          <li
            key={record.date}
            className="mb-4"
          >
            <h3 className="font-semibold mb-2">日付:{record.date}</h3>
            <div className="w-full bg-gray-100 rounded-md p-4">
              総摂取カロリー:{record.calories}kcal / 総タンパク質:{record.protein}g
            </div>
          </li>
        ))}
      </ul>
      </main>
    </>
  );
}