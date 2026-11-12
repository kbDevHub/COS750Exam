import { createContext, useContext, useEffect, useState, useCallback } from "react";

const KEY = "cos212-progress";

const ProgressContext = createContext({
    completed: [],
    markComplete: () => { },
    reset: () => { },
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

    return (
        <ProgressContext.Provider value={{ completed, markComplete, reset }}>
            {children}
        </ProgressContext.Provider>
    );
}

export const useProgress = () => useContext(ProgressContext);