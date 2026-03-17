"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, UserPlus } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    alert("Registration functionality would connect to backend.");
  };

  const fields = [
    { label: "Full Name", field: "fullName" as const, icon: User, type: "text", placeholder: "John Doe" },
    { label: "Email Address", field: "email" as const, icon: Mail, type: "email", placeholder: "your@email.com" },
    { label: "Phone Number", field: "phone" as const, icon: Phone, type: "tel", placeholder: "+91 98765 43210" },
    { label: "City", field: "city" as const, icon: MapPin, type: "text", placeholder: "Mumbai" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ label, field, icon: Icon, type, placeholder }) => (
          <div key={field} className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {label}
            </label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type={type}
                required
                value={formData[field]}
                onChange={update(field)}
                placeholder={placeholder}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-green-950/30 border border-gray-200 dark:border-green-800/40 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={update("password")}
            placeholder="Min. 8 characters"
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-green-950/30 border border-gray-200 dark:border-green-800/40 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showConfirm ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={update("confirmPassword")}
            placeholder="Re-enter password"
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-green-950/30 border border-gray-200 dark:border-green-800/40 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-[#1a6b3c] to-[#166534] hover:from-[#22c55e] hover:to-[#16a34a] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-green-400/30 transition-all disabled:opacity-60 mt-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Create Account
          </>
        )}
      </motion.button>

      <p className="text-xs text-gray-400 text-center">
        By registering, you agree to our{" "}
        <a href="#" className="text-[#22c55e] hover:underline">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="text-[#22c55e] hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
