function Sidebar ({sections, activeId, onSelect})
{
    return(
        <nav className= "sidebar">
            <h2 className= "sidebar-title">Graphs</h2>
            <ul>
                {sections.map ((section) => (
                    <li key ={section.id}>
                        <button
                        className ={section.id === activeId ? "nav-item active" : "nav-item"}
                        onClick={()=> onSelect(section.id)}
                        >
                            {section.title}
                            </button>
                    </li>

                ))}
            </ul>
        </nav>
    );
}

export default Sidebar;
