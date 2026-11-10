// RichText.jsx
export default function RichText({ text }) {
  const parts = text.split(/(\{\{.+?\}\})/g);
  return parts.map((part, i) => {
    const m = part.match(/^\{\{(\w+):(.+)\}\}$/);
    if (m) {
      const [, style, word] = m;
      return <span key={i} className={`rt-${style}`}>{word}</span>;
    }
    return part;
  });
}
