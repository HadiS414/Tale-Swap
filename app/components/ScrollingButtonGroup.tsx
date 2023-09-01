import { useRef } from "react";

type ScrollingButton = {
  label: string;
  action: () => void;
}

type ScrollingButtonGroupProps = {
  buttons: ScrollingButton[];
}

export default function ScrollingButtonGroup({ buttons }: ScrollingButtonGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (scrollOffset: number) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollOffset;
    }
  }

  return (
    <div className="flex overflow-x-auto" ref={containerRef}>
      {buttons.map((button, index) => (
        <button
          key={index}
          className="rounded-full text-off-white px-3 py-[2px] ml-2 mt-3 border border-black bg-blue-500"
          onClick={button.action}
        >
          {button.label}
        </button>
      ))}
    </div>
  )
}