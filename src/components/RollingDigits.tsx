import { memo } from "react";

interface RollingDigitsProps {
  value: string;
  variant: "roll" | "fade";
}

/**
 * Each glyph is keyed by its character, so only the digits that actually
 * change remount and replay their (transform/opacity only) entrance.
 */
export const RollingDigits = memo(function RollingDigits({ value, variant }: RollingDigitsProps) {
  return (
    <span className="digits">
      {Array.from(value).map((char, index) => (
        <span className="digit" key={index}>
          <span key={char} className={`digit__glyph digit__glyph--${variant}`}>
            {char}
          </span>
        </span>
      ))}
    </span>
  );
});
