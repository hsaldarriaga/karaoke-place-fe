import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { usePostApiKaraokeEvents } from "~/gen/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PlaceAutocompleteField } from "./place-autocomplete-field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";

type CreateEventSheetProps = {
  canCreateEvent: boolean;
  currentUserId?: number;
};

type CreateEventFormValues = {
  name: string;
  description: string;
  location: string;
  coordinates: string;
  startTime: string;
  hours: string;
};

const DEFAULT_FORM_VALUES: CreateEventFormValues = {
  name: "",
  description: "",
  location: "",
  coordinates: "",
  startTime: "",
  hours: "",
};

export function CreateEventSheet({
  canCreateEvent,
  currentUserId,
}: CreateEventSheetProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const createEventMutation = usePostApiKaraokeEvents({
    mutation: {
      onSuccess: async () => {
        toast.success("Karaoke event created.");
        reset(DEFAULT_FORM_VALUES);
        setOpen(false);
        await queryClient.invalidateQueries({
          queryKey: ["current-events"],
        });
      },
      onError: (error) => {
        toast.error("Couldn't create the karaoke event.", {
          description:
            error instanceof Error
              ? error.message
              : "Please try again in a moment.",
        });
      },
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen && !createEventMutation.isPending) {
      reset(DEFAULT_FORM_VALUES);
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    const startTime = new Date(values.startTime);
    const hours = Number(values.hours);

    if (
      Number.isNaN(startTime.getTime()) ||
      !Number.isInteger(hours) ||
      hours < 1
    ) {
      toast.error("Please enter a valid start time and duration.");
      return;
    }

    await createEventMutation.mutateAsync({
      data: {
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        location: values.location.trim(),
        coordinates: values.coordinates.trim(),
        startTime: startTime.toISOString(),
        hours,
        createdByUserId: currentUserId,
        isActive: true,
      },
    });
  });

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          type="button"
          disabled={!canCreateEvent || createEventMutation.isPending}
        >
          Create event
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Create a karaoke event</SheetTitle>
          <SheetDescription>
            Set up the name, place, and timing for your next karaoke night.
          </SheetDescription>
        </SheetHeader>

        <form className="flex flex-col gap-4 px-4 pb-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="event-name"
              className="text-sm font-medium text-zinc-950"
            >
              Event name
            </label>
            <Input
              id="event-name"
              placeholder="Friday karaoke with friends"
              maxLength={200}
              disabled={createEventMutation.isPending}
              aria-invalid={errors.name ? "true" : undefined}
              {...register("name", {
                required: "Event name is required.",
                maxLength: {
                  value: 200,
                  message: "Event name must be 200 characters or less.",
                },
              })}
            />
            {errors.name ? (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="event-location"
              className="text-sm font-medium text-zinc-950"
            >
              Location
            </label>
            <Controller
              name="location"
              control={control}
              rules={{
                required: "Location is required.",
                maxLength: {
                  value: 300,
                  message: "Location must be 300 characters or less.",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <PlaceAutocompleteField
                    id="event-location"
                    value={field.value}
                    onChange={field.onChange}
                    onCoordinatesChange={(coordinates) => {
                      setValue("coordinates", coordinates, {
                        shouldDirty: true,
                      });
                    }}
                    disabled={createEventMutation.isPending}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.error ? (
                    <p className="text-sm text-red-600">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-start-time"
                className="text-sm font-medium text-zinc-950"
              >
                Start time
              </label>
              <Input
                id="event-start-time"
                type="datetime-local"
                disabled={createEventMutation.isPending}
                aria-invalid={errors.startTime ? "true" : undefined}
                {...register("startTime", {
                  required: "Start time is required.",
                  validate: (value) => {
                    const startTime = new Date(value);

                    if (Number.isNaN(startTime.getTime())) {
                      return "Please enter a valid start time.";
                    }

                    const latestAllowedStartTime = new Date();
                    latestAllowedStartTime.setMonth(
                      latestAllowedStartTime.getMonth() + 2,
                    );

                    return (
                      startTime <= latestAllowedStartTime ||
                      "Start time cannot be more than 2 months in the future."
                    );
                  },
                })}
              />
              {errors.startTime ? (
                <p className="text-sm text-red-600">
                  {errors.startTime.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-hours"
                className="text-sm font-medium text-zinc-950"
              >
                Duration (hours)
              </label>
              <Input
                id="event-hours"
                type="number"
                min={1}
                step={1}
                placeholder="3"
                disabled={createEventMutation.isPending}
                aria-invalid={errors.hours ? "true" : undefined}
                {...register("hours", {
                  required: "Duration is required.",
                  validate: (value) => {
                    const parsedHours = Number(value);

                    return (
                      (Number.isInteger(parsedHours) && parsedHours >= 1) ||
                      "Duration must be at least 1 hour."
                    );
                  },
                })}
              />
              {errors.hours ? (
                <p className="text-sm text-red-600">{errors.hours.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="event-description"
              className="text-sm font-medium text-zinc-950"
            >
              Description
            </label>
            <Textarea
              id="event-description"
              placeholder="Share the plan, vibe, or song theme for the night."
              maxLength={1000}
              rows={5}
              disabled={createEventMutation.isPending}
              aria-invalid={errors.description ? "true" : undefined}
              {...register("description", {
                maxLength: {
                  value: 1000,
                  message: "Description must be 1000 characters or less.",
                },
              })}
            />
            {errors.description ? (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createEventMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createEventMutation.isPending}>
              {createEventMutation.isPending
                ? "Creating event..."
                : "Create event"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
