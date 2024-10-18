import { useState } from "react";

export const useWindowSize: () => { x: number, y: number } = () => {
  const [size, set_size] = useState<{ x: number, y: number }>({ x: window.innerWidth, y: window.innerHeight });

  window.addEventListener('resize', () => {
    if((size.x - window.innerWidth) > 400 || (size.y - window.innerHeight) > 400) {
      set_size({ x: window.innerWidth, y: window.innerHeight });
    }
  });

  return size;
}
