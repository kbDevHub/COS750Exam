import { createContext, useContext, useEffect, useState, useCallback } from "react";

const KEY = "cos212-progress";

const ProgressContext = createContext({
    completed: [],
    markComplete: () => { },
    reset: () => { },
    clearTestProgress: () => { },
});

export function ProgressProvider({ children }) {
    const [completed, setCompleted] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(KEY)) ?? [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify(completed));
        } catch {
            console.log("issue persisting progress");
        }
    }, [completed]);

    const markComplete = useCallback(
        (path) => setCompleted((c) => (c.includes(path) ? c : [...c, path])),
        []
    );
    const reset = useCallback(() => setCompleted([]), []);
    const clearTestProgress = useCallback(
        () => setCompleted((c) => c.filter((p) => !p.includes("@L") && p !== "/test")),
        []
    );

    return (
        <ProgressContext.Provider value={{ completed, markComplete, reset, clearTestProgress }}>
            {children}
        </ProgressContext.Provider>
    );
}

export const useProgress = () => useContext(ProgressContext);