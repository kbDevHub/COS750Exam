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
            <button className="anim-btn" onClick={play} aria-label="Read aloud" title="Read aloud">🔊</button>
            <button className="anim-btn anim-btn-secondary" onClick={stop} aria-label="Stop reading" title="Stop reading">⏸️</button>
        </div>
    );
}