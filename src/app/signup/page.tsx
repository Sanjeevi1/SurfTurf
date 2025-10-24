"use client";//made into client component
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { validateEmail, validatePassword, validatePhone, validateUsername, ValidationError } from "@/utils/validation";

import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
    phn: "",
  })
  const [errors, setErrors] = React.useState<ValidationError[]>([])
  const [buttonDisabled, setButtonDisabled] = React.useState(false)
  
  const redirectToPage = () => {
    window.location.href = '/login'; // Full-page reload navigation
  };
  
  React.useEffect(() => {
    if (user.username.length > 0 && user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [user])

  const [loading, setLoading] = React.useState(false)

  const validateForm = () => {
    const newErrors: ValidationError[] = [];
    
    const usernameError = validateUsername(user.username);
    if (usernameError) newErrors.push({ field: 'username', message: usernameError });
    
    const emailError = validateEmail(user.email);
    if (emailError) newErrors.push({ field: 'email', message: emailError });
    
    const passwordError = validatePassword(user.password);
    if (passwordError) newErrors.push({ field: 'password', message: passwordError });
    
    const phoneError = validatePhone(user.phn);
    if (phoneError) newErrors.push({ field: 'phn', message: phoneError });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    try {
      setLoading(true)
      const response = await axios.post("/api/users/signup", user)
      console.log("Signup success", response.data)
      toast.success('Signup successful!')
      redirectToPage()
    } catch (error: any) {
      console.log("Signup failed", error.message)
      toast.error(error.response?.data?.message || 'SIGNUP Failed')
    } finally {
      setLoading(false)
    }
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to SurfTurfs
      </h2>


      <form className="my-8" onSubmit={onSignup}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <label htmlFor="username">Username</label>
            <input 
              id="username" 
              placeholder="username" 
              type="text" 
              value={user.username} 
              onChange={(e) => setUser({ ...user, username: e.target.value })} 
              className={errors.find(e => e.field === 'username') ? 'border-red-500' : ''}
            />
            {errors.find(e => e.field === 'username') && (
              <span className="text-red-500 text-sm">{errors.find(e => e.field === 'username')?.message}</span>
            )}
          </LabelInputContainer>
        </div>
        
        <LabelInputContainer className="mb-4">
          <label htmlFor="email">Email Address</label>
          <input 
            id="email" 
            placeholder="email" 
            type="email" 
            value={user.email} 
            onChange={(e) => setUser({ ...user, email: e.target.value })} 
            className={errors.find(e => e.field === 'email') ? 'border-red-500' : ''}
          />
          {errors.find(e => e.field === 'email') && (
            <span className="text-red-500 text-sm">{errors.find(e => e.field === 'email')?.message}</span>
          )}
        </LabelInputContainer>
        
        <LabelInputContainer className="mb-4">
          <label htmlFor="phn">Phone Number</label>
          <input 
            id="phn" 
            placeholder=" +91 XXXXX-XXXXX " 
            type="text" 
            value={user.phn} 
            onChange={(e) => setUser({ ...user, phn: e.target.value })} 
            className={errors.find(e => e.field === 'phn') ? 'border-red-500' : ''}
          />
          {errors.find(e => e.field === 'phn') && (
            <span className="text-red-500 text-sm">{errors.find(e => e.field === 'phn')?.message}</span>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            placeholder="••••••••" 
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })} 
            className={errors.find(e => e.field === 'password') ? 'border-red-500' : ''}
          />
          {errors.find(e => e.field === 'password') && (
            <span className="text-red-500 text-sm">{errors.find(e => e.field === 'password')?.message}</span>
          )}
        </LabelInputContainer>
        <br />

        <button
          className={buttonDisabled ? "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] opacity-60 cursor-not-allowed" :
            "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"}
          type="submit"


        >
          {loading ? "Processing" : "Signup"} &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        <Link href="/login">Visit Login Page</Link>


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
    <div className="flex flex-col space-y-2 w-full">
      {children}
    </div>
  );
};
