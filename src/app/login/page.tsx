"use client";//made into client component
import Link from "next/link";
import React from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandOnlyfans,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",

    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false)


    React.useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    const [loading, setLoading] = React.useState(false)

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
        try {
            setLoading(true)
            const response = await axios.post("/api/users/login", user)
            console.log(response)
            const fetchedUser = response.data.user;
            // Redirect based on the fetched role
            window.location.href = fetchedUser.role === "owner" ? '/admin/home' : '/customer/home';
            console.log("Login success", response.data)
            toast.success("Login success")

        } catch (error: any) {
            console.log("Login failed", error.message)
            toast.error('LOGIN FAILED')//toast not working look into it
        } finally {
            setLoading(false)
        }
    };
    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black align-middle">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                Welcome to SurfTurfs
            </h2>


            <form className="my-8" onSubmit={onLogin}>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" placeholder="email" type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input id="password" placeholder="••••••••" type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })} />
                </LabelInputContainer>
                <br />

                <button
                    className={buttonDisabled ? "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] opacity-60 cursor-not-allowed" :
                        "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"}
                    type="submit"
                >
                    {loading ? "Processing" : "Login"} &rarr;
                    <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                <Link href="/signup">Visit Signup Page</Link><br /><br />
                <Link href="/forgotPwd">Forgot Password</Link>


            </form>


        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={"flex flex-col space-y-2 w-full"}>
            {children}
        </div>
    );
};
