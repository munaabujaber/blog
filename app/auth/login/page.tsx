import { ReturnButton } from "@/components/buttons/return";
import { LogInForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
    return (
        <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
            <div className="space-y-8">
                <ReturnButton href='/' label="Home" />

                <h1 className="text-3xl font-bold">
                    Log In
                </h1>
            </div>

            <LogInForm />

            <p className="text-muted-foreground text-sm">
                Don&apos;t have an account? {""}
                <Link href="/auth/register" className="hover:text-foreground">
                    Register
                </Link>
            </p>
        </div>
    )
}