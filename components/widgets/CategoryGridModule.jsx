"use client";

export default function CategoryGridModule({ data }) {
  const categories = data?.categories || [];
  const shouldScroll = categories.length > 6;

  if (!categories.length) return null;

  return (
    <section
      className="bg-[#f7f7f7] py-8"
      style={{
        marginTop: `${data?.spacingTop || 0}px`,
        marginBottom: `${data?.spacingBottom || 0}px`,
      }}
    >
      <div
        className={`px-4 ${
          shouldScroll ? "overflow-x-auto scrollbar-hide" : ""
        }`}
      >
        <div
          className={
            shouldScroll
              ? "grid grid-flow-col auto-cols-[96px] grid-rows-2 gap-x-5 gap-y-8 w-max"
              : "grid grid-cols-3 gap-x-5 gap-y-10"
          }
        >
          {categories.map((category, index) => (
            <button key={index} className="text-center">
              <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-contain p-5"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-neutral-400">
                    No Image
                  </div>
                )}
              </div>

              <h3 className="mt-4 text-[16px] font-semibold leading-none text-black">
                {category.title}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
