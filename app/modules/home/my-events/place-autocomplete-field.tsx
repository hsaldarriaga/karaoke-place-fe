/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from "react";
import { importLibrary } from "@googlemaps/js-api-loader";

import { Input } from "~/components/ui/input";

type PlaceAutocompleteSelectionEvent = Event & {
  placePrediction?: google.maps.places.PlacePrediction | null;
};

type NearbyAwarePlaceAutocompleteElement =
  google.maps.places.PlaceAutocompleteElement & {
    includedPrimaryTypes?: string[];
  };

type PlaceAutocompleteElementWithValue = NearbyAwarePlaceAutocompleteElement & {
  value?: string;
};

const KARAOKE_VENUE_TYPES = ["karaoke"];

export type PlaceAutocompleteFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
};

export function PlaceAutocompleteField({
  id,
  value,
  onChange,
  onCoordinatesChange,
  disabled = false,
  invalid = false,
}: PlaceAutocompleteFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const placeAutocompleteRef =
    useRef<NearbyAwarePlaceAutocompleteElement | null>(null);
  const onChangeRef = useRef(onChange);
  const onCoordinatesChangeRef = useRef(onCoordinatesChange);
  const valueRef = useRef(value);
  const disabledRef = useRef(disabled);
  const invalidRef = useRef(invalid);
  const [loadError, setLoadError] = useState<string | null>(() =>
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      ? null
      : "Set VITE_GOOGLE_MAPS_API_KEY to enable Google Places autocomplete.",
  );

  useEffect(() => {
    onChangeRef.current = onChange;
    onCoordinatesChangeRef.current = onCoordinatesChange;
  }, [onChange, onCoordinatesChange]);

  useEffect(() => {
    valueRef.current = value;
    disabledRef.current = disabled;
    invalidRef.current = invalid;

    const placeAutocomplete = placeAutocompleteRef.current;

    if (!placeAutocomplete) {
      return;
    }

    placeAutocomplete.toggleAttribute("disabled", disabled);

    if (invalid) {
      placeAutocomplete.setAttribute("aria-invalid", "true");
    } else {
      placeAutocomplete.removeAttribute("aria-invalid");
    }

    const autocompleteWithValue =
      placeAutocomplete as PlaceAutocompleteElementWithValue;

    if (
      typeof autocompleteWithValue.value === "string" &&
      autocompleteWithValue.value !== value
    ) {
      autocompleteWithValue.value = value;
    }
  }, [disabled, invalid, value]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      return;
    }

    let isActive = true;
    let gmpSelectListener: ((event: Event) => void) | null = null;

    async function setupAutocomplete() {
      try {
        await importLibrary("places");

        if (!isActive) {
          return;
        }

        const currentContainer = containerRef.current;
        if (!currentContainer) {
          return;
        }

        const placeAutocomplete =
          new google.maps.places.PlaceAutocompleteElement({
            types: ["establishment"],
          }) as NearbyAwarePlaceAutocompleteElement;
        placeAutocomplete.id = id;
        placeAutocomplete.includedPrimaryTypes = KARAOKE_VENUE_TYPES;
        placeAutocomplete.setAttribute(
          "placeholder",
          "Search for a nearby karaoke venue",
        );
        placeAutocomplete.setAttribute("aria-label", "Event location");
        placeAutocomplete.setAttribute("style", "width: 100%;");

        placeAutocompleteRef.current = placeAutocomplete;

        const autocompleteWithValue =
          placeAutocomplete as PlaceAutocompleteElementWithValue;

        if (typeof autocompleteWithValue.value === "string") {
          autocompleteWithValue.value = valueRef.current;
        }

        const handlePlaceSelect = async (event: Event) => {
          const selection = event as PlaceAutocompleteSelectionEvent;
          const prediction = selection.placePrediction;

          if (!prediction) {
            return;
          }

          const place = prediction.toPlace();
          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location"],
          });

          if (!isActive) {
            return;
          }

          const nextValue = place.formattedAddress ?? place.displayName ?? "";
          const autocompleteWithValue =
            placeAutocomplete as PlaceAutocompleteElementWithValue;

          if (typeof autocompleteWithValue.value === "string") {
            autocompleteWithValue.value = nextValue;
          }

          onChangeRef.current(nextValue);
          onCoordinatesChangeRef.current?.(
            place.location
              ? `${place.location.lat()},${place.location.lng()}`
              : "",
          );
        };

        placeAutocomplete.toggleAttribute("disabled", disabledRef.current);
        if (invalidRef.current) {
          placeAutocomplete.setAttribute("aria-invalid", "true");
        }

        gmpSelectListener = (event: Event) => {
          void handlePlaceSelect(event);
        };
        placeAutocomplete.addEventListener("gmp-select", gmpSelectListener);

        currentContainer.replaceChildren(placeAutocomplete);
        setLoadError(null);
      } catch {
        if (!isActive) {
          return;
        }

        setLoadError(
          "Google Places couldn't load, so you can type the location manually.",
        );
      }
    }

    void setupAutocomplete();

    return () => {
      isActive = false;
      const placeAutocomplete = placeAutocompleteRef.current;

      if (placeAutocomplete && gmpSelectListener) {
        placeAutocomplete.removeEventListener("gmp-select", gmpSelectListener);
      }

      placeAutocomplete?.remove();
      placeAutocompleteRef.current = null;
      container.replaceChildren();
    };
  }, [id]);

  if (loadError) {
    return (
      <>
        <Input
          id={id}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            onCoordinatesChange?.("");
          }}
          placeholder="Downtown karaoke bar"
          maxLength={300}
          disabled={disabled}
          aria-invalid={invalid ? "true" : undefined}
        />
        <p className="text-xs text-zinc-500">{loadError}</p>
      </>
    );
  }

  return <div ref={containerRef} className="min-h-9" />;
}
