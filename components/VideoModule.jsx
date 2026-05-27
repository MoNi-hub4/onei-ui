"use client";

export default function VideoModule() {
  return (
    <section className="w-full bg-black">
      <video
        className="h-auto w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video-poster.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
    </section>
  );
}