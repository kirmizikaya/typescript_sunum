export default function SpriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="preload"
        href="/icons/sprite.svg"
        as="image"
        type="image/svg+xml"
      />
      {children}
    </>
  );
}

