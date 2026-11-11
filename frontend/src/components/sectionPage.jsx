import DijkstraAnimation from "./DijkstraAnimation";
import RichText from "./RichText";
import EdgeExplorer from "./EdgeExplorer"
import QuizRunner from "./QuizRunner";

function SectionPage({ section, onComplete=()=>{} }) {
  return (
    <div>
      <h1>{section.title}</h1>

      {(!section.content || section.content.length === 0) && (
        <p className="section-page-empty">This section is coming soon.</p>
      )}

      {(section.content || []).map((block, index) => {
        if (block.type === "heading") {
          return <h2 key={index}><RichText text={block.text} /></h2>;
        }
        if (block.type === "paragraph") {
          return <p key={index}><RichText text={block.text} /></p>;
        }
        if (block.type === "objectives") {
          return (
            <div key={index} className="section-page-objectives">
              <strong>Learning Objectives</strong>
              <p><RichText text={block.text} /></p>
            </div>
          );
        }
        if (block.type === "divider") {
          return <hr key={index} className="section-page-divider" />;
        }
        if (block.type === "numbered") {
          return (
            <ol key={index}>
              {block.items.map((item, i) => (
                <li key={i}><RichText  text={item} /></li>
              ))}
            </ol>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items.map((item, i) => (
                <li key={i}><RichText text={item} /></li>
              ))}
            </ul>
          );
        }
        if (block.type=="animation")
        {
          return <DijkstraAnimation key={index} />
        }

        if (block.type === "interactive")
        {
          return block.name === "edge"
            ? <EdgeExplorer
                key={index}
                allowWeights={block.allowWeights ?? true}
                allowDirections={block.allowDirections ?? true}
              />
            : null;
        }
        if (block.type ==="quiz")
        {
          return <QuizRunner key={section.id + index} section={block.section} onPass={onComplete} />;
        }
        return null;
      })}
    </div>
  );
}

export default SectionPage;
