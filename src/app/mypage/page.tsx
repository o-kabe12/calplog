"use client";
import Header from "../component/Header";
import { collection, getDocs } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import useSWR from "swr";

type RecordType = {
  date: string;
  calories: number;
  protein: number;
};

// Firestoreからデータを取得するfetcher関数
const fetchRecords = async (email: string): Promise<RecordType[]> => {
  const ref = collection(db, "users", email, "records");
  const snapshot = await getDocs(ref);
  
  const data = snapshot.docs.map((doc) => doc.data() as RecordType);
  data.sort((a, b) => b.date.localeCompare(a.date));
  return data;
};

export default function Home() {
  const { data: session } = useSession();
  
  // SWRでデータフェッチング（useEffectを使わない）
  const { data: records = [], error, isLoading } = useSWR(
    session?.user?.email ? `records-${session.user.email}` : null,
    () => {
      if (!session?.user?.email) throw new Error("No email found");
      return fetchRecords(session.user.email);
    }
  );

  // ローディング状態を表示
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="py-12 px-6 max-w-[1200px] mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        </main>
      </>
    );
  }

  // エラー状態を表示
  if (error) {
    return (
      <>
        <Header />
        <main className="py-12 px-6 max-w-[1200px] mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-red-500">データの読み込みに失敗しました。</p>
          </div>
        </main>
      </>
    );
  }

  console.log(records);

  return (
    <>
      <Header />
      <main className="py-12 px-6 max-w-[1200px] mx-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
            こんにちは！
          </h1>
          <h2 className="text-xl text-gray-600 text-center mb-12">
            マイページへようこそ
          </h2>
          <p className="text-center text-gray-500 mb-12">
            ここでは、あなたのログの記録を確認できます。
          </p>

          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.date}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-gray-200 transition-colors duration-200"
              >
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  記録日: {record.date}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">
                      総摂取カロリー
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {record.calories}
                      <span className="text-base font-medium ml-1">kcal</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">総タンパク質</div>
                    <div className="text-xl font-bold text-gray-900">
                      {record.protein}
                      <span className="text-base font-medium ml-1">g</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}