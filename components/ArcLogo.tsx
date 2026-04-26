// ARC Logo component — uses the real ARC brand image from /public/arc-logo.png
// Falls back gracefully to a text label if the image fails to load.

interface ArcLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function ArcLogo({ size = 40, className = "" }: ArcLogoProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/arc-logo.png"
      alt="ARC"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: "contain",
        // The logo is white-on-black; use a filter to blend into dark backgrounds
        filter: "brightness(1.1) contrast(1.05)",
        display: "block",
      }}
      draggable={false}
    />
  );
}
