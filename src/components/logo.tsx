import Image from "next/image";

export function Logo({
  className = "h-11 w-11",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={88}
      height={88}
      className={className}
      priority={priority}
    />
  );
}
