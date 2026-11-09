import { useState } from "react";
import Sidebar from "./components/sidebar";
import { sections } from "./data/sections";
import SectionPage from "./components/sectionPage";
import "./App.css";

function App() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const activeSection = sections.find((s) => s.id === activeId);

  return (
    <div className="app-layout">
      <Sidebar
        sections={sections}
        activeId={activeId}
        onSelect={setActiveId}
      />
      <main className="content">
        <SectionPage section={activeSection} />
      </main>
    </div>
  );
}

export default App;
