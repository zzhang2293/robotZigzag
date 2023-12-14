import { useEffect, useState } from "react";

export default function useMazeDim(heightFactor, widthFactor) {
  const [maxDim, setMaxDim] = useState(500);
  /**
   * Set the maze to resize when the page changes size
   */
  useEffect(() => {
    const handleResize = () => {
      setMaxDim(
        Math.floor(
          Math.min(
            window.innerWidth / (widthFactor ?? 1),
            window.innerHeight / (heightFactor ?? 1)
          )
        )
      );
    };

    // Add event listener to update dimensions on window resize
    window.addEventListener("resize", handleResize);

    // Call the function once to get initial dimensions
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [heightFactor, widthFactor]);

  return maxDim;
}
