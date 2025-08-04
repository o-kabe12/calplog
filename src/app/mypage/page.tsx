"use client";
import Header from "../component/Header";
import { collection, getDocs } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import useSWR from "swr";
import RecordCard from "../component/RecordCard";
import { RecordType } from "@/types";
import { useState, useMemo } from "react";
import FilteredTabs from "../component/FilteredTabs";


const fetchRecords = async (email: string): Promise<RecordType[]> => {
  const ref = collection(db, "users", email, "records");
  const snapshot = await getDocs(ref);
  
  const data = snapshot.docs.map((doc) => doc.data() as RecordType);
  data.sort((a, b) => b.date.localeCompare(a.date));
  return data;
};

const FILTER_ALL = "all";

export default function MyPage() {
  const { data: session } = useSession();
  
  const { data: records = [], error, isLoading } = useSWR(
    session?.user?.email ? `records-${session.user.email}` : null,
    () => {
      if (!session?.user?.email) throw new Error("No email found");
      return fetchRecords(session.user.email);
    }
  );

  const [selectedMonth, setSelectedMonth] = useState<string>(FILTER_ALL);

  const recordMonthList = useMemo(() => {
    return [...new Set(records.map((record) => record.date.slice(0, 7)))];
  }, [records]);

  const filteredRecords = useMemo(() => {
    return selectedMonth === FILTER_ALL 
      ? records 
      : records.filter((record) => record.date.slice(0, 7) === selectedMonth);
  }, [records, selectedMonth]);

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  const renderPageLayout = (content: React.ReactNode) => (
    <>
      <Header />
      <main className="py-12 px-6 max-w-[1200px] mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          {content}
        </div>
      </main>
    </>
  );

  if (isLoading) {
    return renderPageLayout(<p className="text-gray-500">読み込み中...</p>);
  }

  if (error) {
    return renderPageLayout(<p className="text-red-500">データの読み込みに失敗しました。</p>);
  }

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

          <FilteredTabs
            recordMonthList={recordMonthList}
            selectedMonth={selectedMonth}
            handleMonthClick={handleMonthClick}
            filterAllValue={FILTER_ALL}
          />

          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <RecordCard key={record.date} record={record} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}