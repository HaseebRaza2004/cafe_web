"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = toastIdRef.current++; 
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toastValues = useMemo(
    () => ({
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      info: (msg) => addToast(msg, "info"),
      warning: (msg) => addToast(msg, "warning"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={toastValues}>
      {children}

      {/* Toast Container (Fixed Position) */}
      <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto transform transition-all duration-300 ease-out animate-in slide-in-from-right-full
              flex items-start gap-3 p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border backdrop-blur-md
              ${
                toast.type === "success"
                  ? "bg-black/80 border-green-500/50 text-green-400"
                  : ""
              }
              ${
                toast.type === "error"
                  ? "bg-black/80 border-red-500/50 text-red-400"
                  : ""
              }
              ${
                toast.type === "info"
                  ? "bg-black/80 border-(--color-gold) text-(--color-gold)"
                  : ""
              }
              ${
                toast.type === "warning"
                  ? "bg-black/80 border-orange-500/50 text-orange-400"
                  : ""
              }
            `}
          >
            {/* Icons */}
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
              {toast.type === "info" && <Info className="w-5 h-5" />}
              {toast.type === "warning" && <AlertCircle className="w-5 h-5" />}
            </div>

            {/* Message */}
            <p className="text-sm font-medium leading-relaxed text-white">
              {toast.message}
            </p>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
