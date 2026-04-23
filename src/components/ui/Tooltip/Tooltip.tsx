"use client";

export default function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group inline-flex">
      {children}

      {/* TOOLTIP */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          bottom-full mb-2
          hidden group-hover:block
          z-50
          bg-gray-900 text-white text-xs px-2 py-1 rounded
          whitespace-nowrap
          shadow-lg
        "
      >
        {label}

        {/* arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full
                        border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}