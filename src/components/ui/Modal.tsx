"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  open,
  onOpenChange,
  title,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative w-full ${maxWidth} bg-white dark:bg-[#0f2818] rounded-2xl shadow-2xl border border-gray-100 dark:border-green-800/30`}
                  >
                    {title && (
                      <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-green-800/30">
                        <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
                          {title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-green-900/20 transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        </Dialog.Close>
                      </div>
                    )}
                    <div className="p-6">{children}</div>
                  </motion.div>
                </div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
