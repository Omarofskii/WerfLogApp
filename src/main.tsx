import { createRoot } from "react-dom/client";
import App from "./app/App";
import { InMemoryWerfRepository } from "./infrastructure/InMemoryWerfRepository.ts";
import { seedProjects, seedWerfItems } from "./infrastructure/seedData.ts";
import "./styles/index.css";

// Composition root: choose the data adapter once for this browser session.
const repository = new InMemoryWerfRepository(seedProjects, seedWerfItems);
createRoot(document.getElementById("root")!).render(<App repository={repository} />);
