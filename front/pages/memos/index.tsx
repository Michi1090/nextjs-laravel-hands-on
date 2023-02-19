import { AxiosError, AxiosResponse } from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { axiosApi } from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "../../components/Loading";

type Memo = {
  title: string;
  body: string;
};

const Memo: NextPage = () => {
  const router = useRouter();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { checkLoggedIn } = useAuth();

  useEffect(() => {
    const init = async () => {
      const res: boolean = await checkLoggedIn();
      if (!res) {
        router.push("/");
      }
    };
    axiosApi
      .get("/api/memos")
      .then((res: AxiosResponse) => {
        setMemos(res.data.data);
      })
      .catch((error: AxiosError) => console.log(error.response))
      .finally(() => setIsLoading(false));
    init();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="w-2/3 mx-auto mt-32">
      <div className="w-1/2 mx-auto text-center">
        <button
          className="text-xl mb-12 py-3 px-10 bg-blue-500 text-white rounded-3xl drop-shadow-md hover:bg-blue-400"
          onClick={() => router.push("/memos/post")}
        >
          メモを追加する
        </button>
      </div>
      <div className="mt-3">
        {/* 仮データでの一覧表示 */}
        <div className="grid w-2/3 mx-auto gap-4 grid-cols-2">
          {memos.map((memo: Memo, index) => {
            return (
              <div className="bg-gray-100 shadow-lg mb-5 p-4" key={index}>
                <p className="text-lg font-bold mb-1">{memo.title}</p>
                <p className="">{memo.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Memo;
