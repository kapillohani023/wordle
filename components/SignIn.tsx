import { signIn, auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export async function SignIn() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 border-gray-100 p-10">
        <div className="text-center">
          <h3 className="mt-6 text-3xl tracking-tight text-gray-900">
            Wordle
          </h3>
        </div>

        <div className="mt-8 space-y-6">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="group flex w-full cursor-pointer items-center justify-center gap-3 border border-gray-300 py-3 text-sm text-gray-700 shadow-sm transition-colors hover:text-gray-900"
            >
              <FcGoogle className="h-6 w-6" />
              Sign in with Google
            </button>
          </form>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 transition-colors hover:text-gray-600"
              >
                Terms of Service
              </Link>
            </p>
            <Link
              href="/privacy"
              className="text-xs text-gray-400 underline underline-offset-4 transition-colors hover:text-gray-600"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );  
}
