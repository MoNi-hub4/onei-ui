"use client";

const categories = [
  {
    title: "Apple",
    image: "/categories/apple.webp",
  },
  {
    title: "Sounds",
    image: "/categories/sounds.webp",
  },
  {
    title: "Dyson",
    image: "/categories/dyson.webp",
  },
  {
    title: "Android",
    image: "/categories/android.webp",
  },
  {
    title: "Gaming",
    image: "/categories/gaming.webp",
  },
  {
    title: "Gadgets",
    image: "/categories/gadgets.webp",
  },
  {
    title: "Apple1",
    image: "/categories/apple.webp",
  },
  {
    title: "Sounds1",
    image: "/categories/sounds.webp",
  },
  {
    title: "Dyson1",
    image: "/categories/dyson.webp",
  },
  {
    title: "Android1",
    image: "/categories/android.webp",
  },
  {
    title: "Gaming1",
    image: "/categories/gaming.webp",
  },
  {
    title: "Gadgets1",
    image: "/categories/gadgets.webp",
  },

  // Add more than 6 to test scrolling
  // {
  //   title: "Cameras",
  //   image: "/categories/cameras.webp",
  // },
  // {
  //   title: "Accessories",
  //   image: "/categories/accessories.webp",
  // },
];

export default function CategoryGrid() {
  const shouldScroll = categories.length > 6;

  return (
    <section className="bg-[#f7f7f7] py-8">
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
          {categories.map((category) => (
            <button key={category.title} className="text-center">
              <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-contain p-5"
                />
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
