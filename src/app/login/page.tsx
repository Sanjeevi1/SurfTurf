"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { validateEmail, validatePassword, ValidationError } from "@/utils/validation";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [errors, setErrors] = React.useState<ValidationError[]>([]);

    React.useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    const validateForm = () => {
        const newErrors: ValidationError[] = [];
        
        const emailError = validateEmail(user.email);
        if (emailError) newErrors.push({ field: 'email', message: emailError });
        
        const passwordError = validatePassword(user.password);
        if (passwordError) newErrors.push({ field: 'password', message: passwordError });
        
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
        
        if (!validateForm()) {
            toast.error('Please fix the validation errors');
            return;
        }
        
        try {
            setLoading(true)
            const response = await axios.post("/api/users/login", user)
            console.log(response)
            const fetchedUser = response.data.user;
            // Redirect based on the fetched role
            if (fetchedUser.role === "admin") {
                window.location.href = '/admin/home';
            } else if (fetchedUser.role === "owner") {
                window.location.href = '/admin/home'; // Owners also go to admin panel
            } else {
                window.location.href = '/customer/home';
            }
            console.log("Login success", response.data)
            toast.success("Login success")

        } catch (error: any) {
            console.log("Login failed", error.message)
            toast.error(error.response?.data?.message || 'LOGIN FAILED')
        } finally {
            setLoading(false)
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-4">
                        <span className="text-2xl font-bold text-white">ST</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your SurfTurf account</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={onLogin} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'email') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.find(e => e.field === 'email') && (
                                <span className="text-red-500 text-sm">{errors.find(e => e.field === 'email')?.message}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'password') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.find(e => e.field === 'password') && (
                                <span className="text-red-500 text-sm">{errors.find(e => e.field === 'password')?.message}</span>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <Link href="/forgotPwd" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={buttonDisabled || loading}
                            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 ${
                                buttonDisabled || loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">New to SurfTurf?</span>
                            </div>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/signup"
                            className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
                    <div className="text-xs text-blue-700 space-y-1">
                        <div><strong>Admin:</strong> admin@surfturf.com / admin123</div>
                        <div><strong>Owner:</strong> owner@surfturf.com / owner123</div>
                        <div><strong>Customer:</strong> customer@surfturf.com / customer123</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

