import React, { useState, useRef, useEffect } from "react";
const useHoverFocus = () => {
    const [hovered, setHovered] = useState(false)
    const elem = useRef<HTMLInputElement>(null) 

    const handleMouseOver = () => setHovered(true)
    const handleMouseOut = () => setHovered(false)

    useEffect(() => {
        if (elem.current){
            elem.current.focus();
        }       
    }, [])

    useEffect(() => {
        const node = elem.current;
        if (node){
            node.addEventListener('mouseover', handleMouseOver);
            node.addEventListener('mouseout', handleMouseOut);
            return () => {
                node.removeEventListener('mouseover', handleMouseOver);
                node.removeEventListener('mouseout', handleMouseOut);
            };
        }
    }, [elem.current])

    return [elem, hovered] as const;
}
export default useHoverFocus;