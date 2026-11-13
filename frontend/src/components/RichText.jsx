
function RichText({ text = "" }) {
  const parts = text.split(/(\{\{(?:accent|bold):.*?\}\})/g);

  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\{\{(accent|bold):(.*?)\}\}$/);

        if (!match) return part;

        if (match[1] === "accent") {
          return (
            <span key={index} className="text-accent">
              {match[2]}
            </span>
          );
        }

        if (match[1] === "bold") {
          return <strong key={index}>{match[2]}</strong>;
        }

        return part;
      })}
    </>
  );
}

export default RichText;
