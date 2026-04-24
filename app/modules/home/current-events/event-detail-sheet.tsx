import {
  useGetApiKaraokeEventsParticipants,
  useGetApiKaraokeEventsSongProposals,
  usePostApiKaraokeEventsIdEnterKaraokeEvent,
  usePostApiKaraokeEventsIdAcceptInvitation,
  usePostApiKaraokeEventsIdRejectInvitation,
} from "~/gen/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useCurrentUser } from "~/modules/home/hooks/use-current-user";
import { formatDateRange } from "~/modules/home/utils";
import type { EnrichedKaraokeEvent } from "~/modules/home/types";
import { useQueryClient } from "@tanstack/react-query";

const PARTICIPANT_STATUS = {
  Invited: 0,
  Accepted: 1,
  Rejected: 2,
} as const;

const PARTICIPANT_STATUS_LABEL: Record<number, string> = {
  [PARTICIPANT_STATUS.Invited]: "Invited",
  [PARTICIPANT_STATUS.Accepted]: "Accepted",
  [PARTICIPANT_STATUS.Rejected]: "Rejected",
};

type EventDetailSheetProps = {
  event: EnrichedKaraokeEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EventDetailSheet({
  event,
  open,
  onOpenChange,
}: EventDetailSheetProps) {
  const { currentUserId } = useCurrentUser();
  const queryClient = useQueryClient();

  const isOwner =
    currentUserId !== undefined &&
    event !== null &&
    event.createdByUserId === currentUserId;

  const queryBase = { eventIds: event ? [event.id] : [] };
  const queryEnabled = !!event && open && currentUserId !== undefined;

  const participantsQuery = useGetApiKaraokeEventsParticipants(queryBase, {
    query: { enabled: queryEnabled && isOwner },
  });

  const songProposalsQuery = useGetApiKaraokeEventsSongProposals(
    { EventIds: event ? [event.id] : [] },
    { query: { enabled: queryEnabled } },
  );

  const enterMutation = usePostApiKaraokeEventsIdEnterKaraokeEvent(
    {
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getApiKaraokeEventsParticipants"],
          });
        },
      },
    },
    queryClient,
  );

  const acceptMutation = usePostApiKaraokeEventsIdAcceptInvitation(
    {
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getApiKaraokeEventsParticipants"],
          });
        },
      },
    },
    queryClient,
  );

  const rejectMutation = usePostApiKaraokeEventsIdRejectInvitation(
    {
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getApiKaraokeEventsParticipants"],
          });
        },
      },
    },
    queryClient,
  );

  if (!event) return null;

  const eventParticipants =
    participantsQuery.data?.find((p) => p.eventId === event.id)?.participants ??
    [];

  const myParticipation =
    currentUserId !== undefined
      ? eventParticipants.find((p) => p.userId === currentUserId)
      : undefined;

  const isParticipant = myParticipation !== undefined;

  const songProposals =
    songProposalsQuery.data?.find((p) => p.eventId === event.id)
      ?.songProposals ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{event.name ?? "Untitled karaoke night"}</SheetTitle>
        </SheetHeader>

        <div className="px-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-700">Date: </span>
              {formatDateRange(event.startTime, event.hours)}
            </span>
            <span className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-700">Location: </span>
              {event.location || "To be confirmed"}
            </span>
            <span className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-700">Description: </span>
              {event.description || "No description provided."}
            </span>
          </div>

          <Separator className="my-4" />

          {/* Participants section */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-zinc-950">
              Participants
            </h3>

            {isOwner && participantsQuery.isPending ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-9 animate-pulse rounded-lg bg-zinc-100"
                  />
                ))}
              </div>
            ) : isOwner ? (
              eventParticipants.length === 0 ? (
                <p className="text-sm text-zinc-500">No participants yet.</p>
              ) : (
                <ul className="space-y-2">
                  {eventParticipants.map((participant) => (
                    <li
                      key={participant.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-700">
                          User #{participant.userId}
                        </span>
                        <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-500">
                          {PARTICIPANT_STATUS_LABEL[participant.status] ??
                            "Unknown"}
                        </span>
                      </div>

                      {isOwner &&
                        participant.status === PARTICIPANT_STATUS.Invited && (
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={
                                acceptMutation.isPending ||
                                rejectMutation.isPending
                              }
                              onClick={() =>
                                acceptMutation.mutate({
                                  id: event.id,
                                  data: {
                                    hostUserId: currentUserId,
                                    userId: participant.userId,
                                  },
                                })
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={
                                acceptMutation.isPending ||
                                rejectMutation.isPending
                              }
                              onClick={() =>
                                rejectMutation.mutate({
                                  id: event.id,
                                  data: {
                                    hostUserId: currentUserId,
                                    userId: participant.userId,
                                  },
                                })
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-sm text-zinc-600">
                {event.participantCount}{" "}
                {event.participantCount === 1 ? "participant" : "participants"}
              </p>
            )}
          </section>

          <Separator className="my-4" />

          {/* Song proposals section */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-zinc-950">
              Proposed songs
            </h3>

            {songProposalsQuery.isPending ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-9 animate-pulse rounded-lg bg-zinc-100"
                  />
                ))}
              </div>
            ) : songProposals.length === 0 ? (
              <p className="text-sm text-zinc-500">No songs proposed yet.</p>
            ) : (
              <ol className="space-y-2">
                {songProposals.map((proposal, index) => (
                  <li
                    key={proposal.id}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
                  >
                    <span className="text-xs font-medium text-zinc-400 w-5 text-right shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-700">
                        {proposal.song.title ?? "Untitled"}
                      </p>
                      {proposal.song.artist && (
                        <p className="truncate text-xs text-zinc-500">
                          {proposal.song.artist}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Join button for non-owners who aren't participants */}
          {!isOwner && !isParticipant && currentUserId !== undefined && (
            <>
              <Separator />
              <Button
                className="w-full"
                disabled={enterMutation.isPending}
                onClick={() =>
                  enterMutation.mutate({
                    id: event.id,
                    data: { userId: currentUserId },
                  })
                }
              >
                {enterMutation.isPending
                  ? "Joining…"
                  : "Show interest in joining"}
              </Button>
            </>
          )}

          {!isOwner && isParticipant && (
            <>
              <Separator />
              <p className="text-center text-sm text-zinc-500">
                You&apos;re on the list{" "}
                {myParticipation?.status !== undefined
                  ? `· ${PARTICIPANT_STATUS_LABEL[myParticipation.status] ?? "status unknown"}`
                  : ""}
              </p>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
