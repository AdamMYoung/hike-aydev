"use client";

import debounce from 'lodash.debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Checkbox, Input, Label } from 'ui';

type GroupSearchFiltersProps = {
  isUserAuthenticated: boolean;
};

export const GroupSearchFilters = ({ isUserAuthenticated }: GroupSearchFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const isHideComplete = searchParams.get("hideComplete") === "true" ? true : false;
  const isHideIncomplete = searchParams.get("hideIncomplete") === "true" ? true : false;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    debounce((e) => {
      const query = createQueryString("searchTerm", e.target.value);

      router.push(pathname + "?" + query);
    }, 100),
    [pathname, router]
  );

  const handleHideCompleteChange = () => {
    router.push(pathname + "?" + createQueryString("hideComplete", `${!isHideComplete}`));
  };

  const handleHideIncompleteChange = () => {
    router.push(pathname + "?" + createQueryString("hideIncomplete", `${!isHideIncomplete}`));
  };

  const handleHideCompleteHover = () => {
    router.prefetch(pathname + "?" + createQueryString("hideComplete", `${!isHideComplete}`));
  };

  const handleHideIncompleteHover = () => {
    router.prefetch(pathname + "?" + createQueryString("hideIncomplete", `${!isHideIncomplete}`));
  };

  return (
    <div className="p-4 shadow bg-white space-y-4">
      <div className="grid w-full max-w-sm items-center gap-2  ">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Scafell Pike"
          defaultValue={searchParams.get("searchTerm") ?? ""}
          onChange={handleInputChange}
        />
      </div>

      {isUserAuthenticated ? (
        <>
          <div className="flex w-full items-center gap-2" onMouseOver={handleHideCompleteHover}>
            <Checkbox id="hideComplete" defaultChecked={isHideComplete} onClick={handleHideCompleteChange} />
            <Label htmlFor="hideComplete">Hide complete</Label>
          </div>
          <div className="flex w-full items-center gap-2" onMouseOver={handleHideIncompleteHover}>
            <Checkbox id="hideIncomplete" defaultChecked={isHideIncomplete} onClick={handleHideIncompleteChange} />
            <Label htmlFor="hideIncomplete">Hide incomplete</Label>
          </div>
        </>
      ) : null}
    </div>
  );
};
