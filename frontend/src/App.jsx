
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
import { ProgressProvider } from "./components/Progress";
import Adjacency from "./pages/Adjacency";
import Sandbox from "./pages/Sandbox";
import Profile from "./pages/Profile";
import BadgeToaster from "./components/BadgeToaster";
import Cyclic from "./pages/Cyclic";
import Connected from "./pages/Connected";

function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen bg-gray-50">

                <ProgressProvider>
                    <BadgeToaster />
                    {/* Sidebar */}
                    <Sidebar />
                    <NoteTaker />

                    {/* Main content */}
                    <main className="min-w-0 flex-1 px-6 pb-8 pt-16 md:ml-[220px] md:px-12 md:py-10">
                        <div className="mx-auto max-w-5xl">

                            <Routes>
                                <Route path="/" element={<Introduction />} />
                                <Route path="/nodes" element={<Nodes />} />
                                <Route path="/edges" element={<Edges />} />
                                <Route path="/weights" element={<Weights />} />
                                <Route path = "/adjacency" element={<Adjacency/>}/>
                                <Route path="/dijkstra" element={<Dijkstra />} />
                                <Route path="/test" element={<Test />} />
                                <Route path="/shortest-path" element={<Short />} />
                                <Route path="/sandbox" element={<Sandbox />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/connected" element={<Connected />} />
                                <Route path="/cyclic" element={<Cyclic />} />
                            </Routes>

                        </div>
                    </main>

                </ProgressProvider>

            </div>
        </BrowserRouter>
    );
}

export default App;
