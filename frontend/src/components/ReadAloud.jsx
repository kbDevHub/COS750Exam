export default function ReadAloud({ text }) {
    const supported = typeof window !== "undefined" && "speechSynthesis" in window;
    if (!supported) return null;

    const play = () => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    };
    const stop = () => window.speechSynthesis.cancel();

    return (
        <div className="anim-controls">
            <button className="anim-btn" onClick={play}>🔊</button>
            <button className="anim-btn anim-btn-secondary" onClick={stop}>⏸️</button>
        </div>
    );
}