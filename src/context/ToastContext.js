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

  const deleteToastFromArray = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const removeToast = useCallback(
    (id) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
      );

      setTimeout(() => {
        deleteToastFromArray(id);
      }, 300);
    },
    [deleteToastFromArray],
  );

  const addToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = toastIdRef.current++;

      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

      if (duration) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast],
  );

  const toastValues = useMemo(
    () => ({
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      info: (msg) => addToast(msg, "info"),
      warning: (msg) => addToast(msg, "warning"),
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={toastValues}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-3 w-[90%] md:w-full md:max-w-sm lg:max-w-md pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl
              transition-all duration-300 ease-in-out
              
              ${/* ENTER ANIMATION: Slide Down & Fade In */ ""}
              ${!toast.exiting ? "animate-in slide-in-from-top-full fade-in opacity-100 translate-y-0" : ""}

              ${/* EXIT ANIMATION: Slide Up & Fade Out */ ""}
              ${toast.exiting ? "opacity-0 -translate-y-full -mb-12.5" : ""}

              ${/* COLORS based on Type */ ""}
              ${toast.type === "success" ? "bg-black/90 border-green-500/50 text-green-400" : ""}
              ${toast.type === "error" ? "bg-black/90 border-red-500/50 text-red-400" : ""}
              ${toast.type === "info" ? "bg-black/90 border-(--color-gold) text-(--color-gold)" : ""}
              ${toast.type === "warning" ? "bg-black/90 border-orange-500/50 text-orange-400" : ""}
            `}
          >
            {/* Icon Section */}
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
              {toast.type === "info" && <Info className="w-5 h-5" />}
              {toast.type === "warning" && <AlertCircle className="w-5 h-5" />}
            </div>

            {/* Message Section */}
            <p className="text-sm font-medium leading-relaxed text-white flex-1">
              {toast.message}
            </p>

            {/* Close Button */}
            <button
              aria-label="Close message"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
