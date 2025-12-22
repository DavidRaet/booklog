import { useContext } from "react";
import { BookContext } from "../context/BookContext.jsx";
export function useBook() {
    const context = useContext(BookContext);
    if (!context){
        throw new Error("BookContext was used outside of BookProvider");
    }
    return context;
}