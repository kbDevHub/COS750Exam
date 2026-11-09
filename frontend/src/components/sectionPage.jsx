function SectionPage({ section }) {
  return (
    <div>
      <h1>{section.title}</h1>

      {(!section.content || section.content.length === 0) && (
        <p className="section-page-empty">This section is coming soon.</p>
      )}

      {(section.content || []).map((block, index) => {
        if (block.type === "heading") {
          return <h2 key={index}>{block.text}</h2>;
        }
        if (block.type === "paragraph") {
          return <p key={index}>{block.text}</p>;
        }
        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}

export default SectionPage;
