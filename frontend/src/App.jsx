
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar";

import Introduction from "./pages/Introduction";
import Nodes from "./pages/Nodes";
import Edges from "./pages/Edges";
import Weights from "./pages/Weights";
import Dijkstra from "./pages/Dijkstra";
import Test from "./pages/Test";
import Short from "./pages/Short";
import NoteTaker from "./components/NoteTaker";


function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen bg-gray-50">

                {/* Sidebar */}
                <Sidebar />
                <NoteTaker />

                {/* Main content */}
                <main className="ml-[180px] min-w-0 flex-1 px-6 py-8 md:px-12 md:py-10">
                    <div className="mx-auto max-w-5xl">

                        <Routes>
                            <Route path="/" element={<Introduction />} />
                            <Route path="/nodes" element={<Nodes />} />
                            <Route path="/edges" element={<Edges />} />
                            <Route path="/weights" element={<Weights />} />
                            <Route path="/dijkstra" element={<Dijkstra />} />
                            <Route path="/test" element={<Test />} />
                            <Route path="/shortest-path" element={<Short />} />
                        </Routes>

                    </div>
                </main>

            </div>
        </BrowserRouter>
    );
}

export default App;
