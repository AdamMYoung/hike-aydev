import { Profile } from "@templates/profile";
import Link from "next/link";
import { Button, ElementProps, cn } from "ui";

type TopNavigationProps = Omit<ElementProps<"div">, "children"> & {
  isUserAuthenticated: boolean;
};

export const TopNavigation = ({ className, isUserAuthenticated, ...rest }: TopNavigationProps) => {
  const _className = cn("w-full justify-between shadow flex p-4 items-center border-b", className);

  return (
    <div className={_className} {...rest}>
      <div className="flex gap-6 items-center">
        <span className="text-3xl w-full">
          <span className="font-semibold">Hike</span>
          <span className="font-light">.aydev</span>
        </span>

        <Link href="/">
          <Button className="text-lg" variant="link">
            Fells
          </Button>
        </Link>
        <Link legacyBehavior href="/timeline">
          <Button variant="link" className="text-lg" disabled={!isUserAuthenticated}>
            Timeline
          </Button>
        </Link>
        <Link legacyBehavior href="/integrations">
          <Button className="text-lg" variant="link" disabled={!isUserAuthenticated}>
            Integrations
          </Button>
        </Link>
      </div>

      {/* @ts-expect-error Server Component */}
      <Profile />
    </div>
  );
};
