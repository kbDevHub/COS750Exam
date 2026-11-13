import ReadAloud from "../components/ReadAloud";

const DEFINITION ="Graph theory is the study of objects, called vertices ,and the connections between them, called edges"

function Introduction() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">
        Introduction to Graph Theory
      </h1>
      <ReadAloud text={DEFINITION}/>
      <p className="mb-6 text-lg leading-8 text-gray-600">
        Graph theory is the study of objects, called vertices, and the connections between them, called edges.
      </p>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-2xl font-semibold text-indigo-600">
          Where are graphs used?
        </h2>

        <ul className="list-inside list-disc space-y-2 text-gray-700">
          <li>Social networks (e.g., Facebook, Twitter)</li>
          <li>Transportation networks (e.g., roads, railways)</li>
          <li>Computer networks (e.g., the internet)</li>
          <li>Biological networks (e.g., protein-protein interaction networks)</li>
          <li>Recommendation systems (e.g., Netflix, Amazon)</li>
          <li>Navigation systems</li>
        </ul>
      </div>
    </div>
  );
}

export default Introduction;
