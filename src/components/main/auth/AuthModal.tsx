"use client";

import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Target } from "lucide-react";
import LoginForm from "./LoginForm";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-md bg-white dark:bg-[#0f2818] rounded-2xl shadow-2xl shadow-green-900/20 border border-gray-100 dark:border-green-800/30 overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Header gradient */}
              <div className="bg-gradient-to-br from-[#155e3a] to-[#0d3d27] px-6 pt-6 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-white font-bold">Robin Hood Army</span>
                  </div>
                  <Dialog.Close asChild>
                    <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>
              </div>

              {/* Form content */}
              <div className="px-6 py-6">
                <LoginForm />
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
