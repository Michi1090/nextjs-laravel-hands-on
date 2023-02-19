import { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { axiosApi } from "../../lib/axios";
import { RequiredMark } from "../../components/RequiredMark";
import { useAuth } from "../../hooks/useAuth";

type memoForm = {
  title: string;
  body: string;
};

type Validation = {
  title?: string;
  body?: string;
};

const Post: NextPage = () => {
  const router = useRouter();
  const [memoForm, setMemoForm] = useState<memoForm>({
    title: "",
    body: "",
  });
  const [validation, setValidation] = useState<Validation>({});
  const { checkLoggedIn } = useAuth();

  useEffect(() => {
    const init = async () => {
      const res: boolean = await checkLoggedIn();
      if (!res) {
        router.push("/");
      }
    };
    init();
  }, []);

  const updateMemoForm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMemoForm({ ...memoForm, [e.target.name]: e.target.value });
  };

  const createMemo = () => {
    setValidation({});
    axiosApi.get("/sanctum/csrf-cookie").then((res) => {
      axiosApi
        .post("/api/memos", memoForm)
        .then((res: AxiosResponse) => {
          router.push("/memos");
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 422) {
            const errors = error.response?.data.errors;
            const validationMessages: { [index: string]: string } =
              {} as Validation;
            Object.keys(errors).map((key: string) => {
              validationMessages[key] = errors[key][0];
            });
            setValidation(validationMessages);
          }
          if (error.response?.status === 500) {
            alert("システムエラーです！");
          }
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
          {validation.title && (
            <p className="py-3 text-red-500">{validation.title}</p>
          )}
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
          {validation.body && (
            <p className="py-3 text-red-500">{validation.body}</p>
          )}
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
