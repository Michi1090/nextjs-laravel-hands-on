import { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { axiosApi } from "../../lib/axios";
import { RequiredMark } from "../../components/RequiredMark";

type memoForm = {
  title: string;
  body: string;
};

const Post: NextPage = () => {
  const router = useRouter();

  const [memoForm, setMemoForm] = useState<memoForm>({
    title: "",
    body: "",
  });

  const [validation, setValidation] = useState<memoForm>({
    title: "",
    body: "",
  });

  const updateMemoForm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMemoForm({ ...memoForm, [e.target.name]: e.target.value });
  };

  const createMemo = () => {
    axiosApi.get("/sanctum/csrf-cookie").then((res) => {
      axiosApi
        .post("/api/memos", memoForm)
        .then((res: AxiosResponse) => {
          console.log(res.data);
        })
        .catch((error: AxiosError) => {
          console.log(error.response);
        });
    });
  };

  return (
    <div className="w-2/3 mx-auto">
      <div className="w-1/2 mx-auto mt-32 border-2 px-12 py-16 rounded-2xl">
        <h3 className="mb-10 text-2xl text-center">メモの登録</h3>
        <div className="mb-5">
          <div className="flex justify-start my-2">
            <p>タイトル</p>
            <RequiredMark />
          </div>
          <input
            className="p-2 border rounded-md w-full outline-none"
            name="title"
            value={memoForm.title}
            onChange={updateMemoForm}
          />
        </div>
        <div className="mb-5">
          <div className="flex justify-start my-2">
            <p>メモの内容</p>
            <RequiredMark />
          </div>
          <textarea
            className="p-2 border rounded-md w-full outline-none"
            name="body"
            cols={30}
            rows={4}
            value={memoForm.body}
            onChange={updateMemoForm}
          />
        </div>
        <div className="text-center">
          <button
            className="bg-gray-700 text-gray-50 py-3 sm:px-20 px-10 mt-8 rounded-xl cursor-pointer drop-shadow-md hover:bg-gray-600"
            onClick={createMemo}
          >
            登録する
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
