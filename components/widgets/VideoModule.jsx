"use client";

export default function VideoModule({ data }) {
  if (!data?.videoUrl) return null;

  return (
    <section
      className="w-full bg-black"
      style={{
        marginTop: `${data?.spacingTop || 0}px`,
        marginBottom: `${data?.spacingBottom || 0}px`,
      }}
    >
      <video
        key={data.videoUrl}
        className="h-auto w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={data?.posterUrl || "/video-poster.jpg"}
      >
        <source src={data.videoUrl} type="video/mp4" />
      </video>
    </section>
  );
}