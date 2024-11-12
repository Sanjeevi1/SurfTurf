"use client";
import Link from "next/link";
import React from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";




export default function AddPage() {
  const router=useRouter();
  const [email,setEmail]=React.useState("");
   

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload = {
      email:email,
    };

    try {
      const response = await axios.post("/api/admin/addOwner", payload);
      console.log("Turf Owner Added", response.data);
      toast.success("Turf Owner Added");
      router.push("/login");
    } catch (error: any) {
      console.log("Turf Owner failed to add", error.message);
      toast.error(error.message);
    }
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Add new Turf Owner details
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        
        
        <LabelInputContainer className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" onChange={(e)=>setEmail(e.target.value)} />
                </LabelInputContainer>
        
        
<br />
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Enable Turf Owner Access &rarr;
          <BottomGradient />
        </button>
        <button
  type="button"
  onClick={()=>{
    window.location.replace('/home')
  }}
  className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
>
  Back
</button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
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

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string; }) => (
  <div className="flex flex-col space-y-2 w-full">{children}</div>
);
