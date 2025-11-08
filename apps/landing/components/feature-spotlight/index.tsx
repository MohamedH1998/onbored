import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureSpotlightProps {
  logo?: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  onButtonClick?: () => void;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  buttonClassName?: string;
  layout?: "centered" | "left" | "right";
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
}

const FeatureSpotlight: React.FC<FeatureSpotlightProps> = ({
  logo,
  title,
  description,
  buttonText,
  buttonVariant = "outline",
  buttonSize = "default",
  onButtonClick,
  className,
  titleClassName,
  descriptionClassName,
  buttonClassName,
  layout = "left",
  maxWidth = "4xl",
}) => {
  const containerClasses = cn(
    "w-full",
    {
      "text-center": layout === "centered",
      "text-left": layout === "left",
      "text-right": layout === "right",
    },
    className,
  );

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  };

  return (
    <div className={containerClasses}>
      <div
        className={cn(
          "flex max-w-6xl flex-col p-10 lg:block space-y-10",
          maxWidthClasses[maxWidth],
        )}
      >
        <div className="flex flex-col gap-4">
          {logo && (
            <div className="mb-6 flex items-center justify-center">{logo}</div>
          )}

          <h3
            className={cn(
              "max-w-3xl text-balance text-4xl font-medium md:text-5xl lg:mt-16 xl:text-6xl",
              titleClassName,
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-lg text-muted-foreground md:text-xl",
              "leading-relaxed",
              {
                "mx-auto": layout === "centered",
              },
              descriptionClassName,
            )}
          >
            {description}
          </p>
        </div>
        <div
          className={cn("", {
            "flex justify-center": layout === "centered",
            "flex justify-start": layout === "left",
            "flex justify-end": layout === "right",
          })}
        >
          <Button
            variant={buttonVariant}
            size={buttonSize}
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSpotlight;
