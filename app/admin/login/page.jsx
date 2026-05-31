"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (
      email === "admin@onei.lk" &&
      password === "admin123"
    ) {
      document.cookie =
        "admin-auth=true; path=/";

      router.push("/admin/cms/page-builder");
    } else {
      alert("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Onei CMS
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Admin Login
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 px-4 rounded-xl border outline-none"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-12 px-4 rounded-xl border outline-none"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-black text-white font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}