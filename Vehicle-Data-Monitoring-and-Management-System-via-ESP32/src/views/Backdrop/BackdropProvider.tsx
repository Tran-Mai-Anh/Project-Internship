import { createContext, useContext, useState, type ReactNode } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface BackDropContextProps {
  showBackDrop: () => void;
  hideBackDrop: () => void;
}

const BackDropContext = createContext<BackDropContextProps | undefined>(
  undefined
);

export function BackDropProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const showBackDrop = () => setIsOpen(true);
  const hideBackDrop = () => setIsOpen(false);

  return (
    <BackDropContext value={{ showBackDrop, hideBackDrop }}>
        {children}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </BackDropContext>
  );
}

export const useBackDrop = () => {
    const context = useContext(BackDropContext);
    if(!context){
        throw new Error("Error getting backdrop");
    }

    return context;
}
