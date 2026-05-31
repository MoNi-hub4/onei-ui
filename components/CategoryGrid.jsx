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
];

export default function CategoryGrid() {
  return (
    <section className="bg-[#f7f7f7] px-2 py-8">
      <div className="grid grid-cols-3 gap-x-5 gap-y-10">
        {categories.map((category) => (
          <button key={category.title} className="text-center">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-contain p-5"
              />
            </div>

            <h3 className="mt-5 text-[18px] font-semibold leading-none text-black">
              {category.title}
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
}