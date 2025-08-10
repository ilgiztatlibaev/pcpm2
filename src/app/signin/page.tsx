"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="max-w-sm mx-auto pt-20 p-4">
      <h1 className="text-2xl font-semibold mb-4">Вход по email</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full border rounded p-2 mb-3"
      />
      <button
        onClick={() => signIn("email", { email })}
        className="w-full bg-black text-white rounded p-2"
      >
        Отправить ссылку
      </button>
      <button
        onClick={() => signIn("dev-guest", { redirect: true, callbackUrl: "/" })}
        className="w-full bg-gray-800 text-white rounded p-2 mt-2"
      >
        Войти как гость (DEV)
      </button>
      <p className="text-sm text-gray-500 mt-3">
        В разработке ссылка входа печатается в консоли сервера.
      </p>
    </div>
  );
}


