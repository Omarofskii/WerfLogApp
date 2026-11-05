import type { WerfRepository } from "../application/WerfRepository.ts";
import { WerfProvider } from "./providers/WerfProvider";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";

export default function App({ repository }: { repository: WerfRepository }) {
  return (
    <WerfProvider repository={repository}>
      <RouterProvider router={router} />
      <Toaster />
    </WerfProvider>
  );
}
