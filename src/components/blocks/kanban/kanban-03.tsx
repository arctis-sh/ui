"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

type Kanban03Props = {
  className?: string;
};

type Filter = "all" | "design" | "eng" | "content";
type Tag = Exclude<Filter, "all">;

type Card = {
  id: string;
  title: string;
  tag: Tag;
};

type Column = {
  id: string;
  title: string;
  cards: Card[];
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "eng", label: "Eng" },
  { id: "content", label: "Content" },
];

const INITIAL: Column[] = [
  {
    id: "todo",
    title: "Ready",
    cards: [
      { id: "a1", title: "Icon pass for empty states", tag: "design" },
      { id: "a2", title: "Footer link audit", tag: "content" },
      { id: "a3", title: "Kanban drag affordance", tag: "eng" },
    ],
  },
  {
    id: "doing",
    title: "Building",
    cards: [
      { id: "a4", title: "Settings form layout", tag: "eng" },
      { id: "a5", title: "Team portrait hover", tag: "design" },
    ],
  },
  {
    id: "done",
    title: "Shipped",
    cards: [
      { id: "a6", title: "Login / signup pair", tag: "eng" },
      { id: "a7", title: "Pricing ticker", tag: "design" },
    ],
  },
];

function findColumnId(columns: Column[], id: string) {
  if (columns.some((column) => column.id === id)) return id;
  return columns.find((column) => column.cards.some((card) => card.id === id))
    ?.id;
}

function CardBody({ card }: { card: Card }) {
  return (
    <>
      <p className="text-sm tracking-wide text-foreground">{card.title}</p>
      <p className="mt-1 text-[11px] tracking-wide text-muted-foreground capitalize">
        {card.tag}
      </p>
    </>
  );
}

function SortableCard({ card }: { card: Card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "cursor-grab rounded-lg bg-muted px-3 py-2.5 active:cursor-grabbing",
        isDragging && "opacity-0",
      )}
      {...attributes}
      {...listeners}
    >
      <CardBody card={card} />
    </li>
  );
}

function ColumnDrop({
  id,
  children,
  empty,
}: {
  id: string;
  children: ReactNode;
  empty: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <ul ref={setNodeRef} className="flex flex-col gap-2">
      {empty ? (
        <li className="rounded-lg border border-dashed border-border px-3 py-2.5 text-center text-xs tracking-wide text-muted-foreground">
          Empty
        </li>
      ) : (
        children
      )}
    </ul>
  );
}

export function Kanban03({ className }: Kanban03Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [columns, setColumns] = useState(INITIAL);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const visibleColumns = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        cards:
          filter === "all"
            ? column.cards
            : column.cards.filter((card) => card.tag === filter),
      })),
    [columns, filter],
  );

  const activeCard = useMemo(() => {
    if (!activeId) return null;
    for (const column of columns) {
      const card = column.cards.find((item) => item.id === activeId);
      if (card) return card;
    }
    return null;
  }, [activeId, columns]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeCardId = String(active.id);
    const overId = String(over.id);

    setColumns((current) => {
      const fromId = findColumnId(current, activeCardId);
      const toId = findColumnId(current, overId);
      if (!fromId || !toId || fromId === toId) return current;

      const fromColumn = current.find((column) => column.id === fromId);
      const toColumn = current.find((column) => column.id === toId);
      if (!fromColumn || !toColumn) return current;

      const moving = fromColumn.cards.find((card) => card.id === activeCardId);
      if (!moving) return current;

      const overIndex = toColumn.cards.findIndex((card) => card.id === overId);
      const insertIndex = overIndex >= 0 ? overIndex : toColumn.cards.length;

      return current.map((column) => {
        if (column.id === fromId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== activeCardId),
          };
        }
        if (column.id === toId) {
          const next = column.cards.filter((card) => card.id !== activeCardId);
          next.splice(insertIndex, 0, moving);
          return { ...column, cards: next };
        }
        return column;
      });
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeCardId = String(active.id);
    const overId = String(over.id);

    setColumns((current) => {
      const columnId = findColumnId(current, activeCardId);
      if (!columnId) return current;
      if (findColumnId(current, overId) !== columnId) return current;

      const column = current.find((item) => item.id === columnId);
      if (!column) return current;

      const oldIndex = column.cards.findIndex((card) => card.id === activeCardId);
      const newIndex =
        overId === columnId
          ? column.cards.length - 1
          : column.cards.findIndex((card) => card.id === overId);

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return current;

      return current.map((item) =>
        item.id === columnId
          ? { ...item, cards: arrayMove(item.cards, oldIndex, newIndex) }
          : item,
      );
    });
  }

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="flex flex-col gap-4 @[40rem]:flex-row @[40rem]:items-end @[40rem]:justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
              Filtered board
            </h2>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              Filter by team, then drag cards into place.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs tracking-wide transition-colors duration-200 ease-out",
                  filter === item.id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <DndContext
          id="kanban-03"
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="mt-8 flex flex-col gap-6 @[40rem]:grid @[40rem]:grid-cols-3 @[40rem]:gap-4">
            {visibleColumns.map((column) => (
              <div key={column.id} className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
                  <h3 className="text-sm font-medium tracking-wide text-foreground">
                    {column.title}
                  </h3>
                  <span className="text-xs tracking-wide text-muted-foreground tabular-nums">
                    {column.cards.length}
                  </span>
                </div>
                <SortableContext
                  id={`kanban-03-${column.id}`}
                  items={column.cards.map((card) => card.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ColumnDrop id={column.id} empty={column.cards.length === 0}>
                    {column.cards.map((card) => (
                      <SortableCard key={card.id} card={card} />
                    ))}
                  </ColumnDrop>
                </SortableContext>
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="cursor-grabbing rounded-lg bg-muted px-3 py-2.5 ring-1 ring-border">
                <CardBody card={activeCard} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </section>
  );
}
