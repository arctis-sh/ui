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

type Kanban01Props = {
  className?: string;
};

type Card = {
  id: string;
  title: string;
  meta: string;
};

type Column = {
  id: string;
  title: string;
  cards: Card[];
};

const INITIAL: Column[] = [
  {
    id: "todo",
    title: "To do",
    cards: [
      { id: "t1", title: "Map pricing tiers", meta: "Marketing" },
      { id: "t2", title: "Collect launch assets", meta: "Design" },
    ],
  },
  {
    id: "doing",
    title: "In progress",
    cards: [
      { id: "t3", title: "Ship hero-05 polish", meta: "Product" },
      { id: "t4", title: "Write FAQ answers", meta: "Content" },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "t5", title: "Navbar variants", meta: "Engineering" }],
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
      <p className="text-sm font-medium tracking-wide text-foreground">
        {card.title}
      </p>
      <p className="mt-1 text-xs tracking-wide text-muted-foreground">
        {card.meta}
      </p>
    </>
  );
}

function SortableCard({
  card,
  className,
}: {
  card: Card;
  className?: string;
}) {
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
        "cursor-grab rounded-lg bg-background px-3 py-3 active:cursor-grabbing",
        isDragging && "opacity-0",
        className,
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
    <ul
      ref={setNodeRef}
      className="flex flex-col gap-2 rounded-xl bg-muted p-2"
    >
      {empty ? (
        <li className="rounded-lg border border-dashed border-border px-3 py-3 text-center text-xs tracking-wide text-muted-foreground">
          Empty
        </li>
      ) : (
        children
      )}
    </ul>
  );
}

export function Kanban01({ className }: Kanban01Props) {
  const [columns, setColumns] = useState(INITIAL);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
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
        <div>
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Sprint board
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Drag cards — others shift to make room.
          </p>
        </div>

        <DndContext
          id="kanban-01"
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="mt-8 flex flex-col gap-6 @[40rem]:grid @[40rem]:grid-cols-3 @[40rem]:gap-4">
            {columns.map((column) => (
              <div key={column.id} className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2 px-1">
                  <h3 className="text-sm font-medium tracking-wide text-foreground">
                    {column.title}
                  </h3>
                  <span className="text-xs tracking-wide text-muted-foreground tabular-nums">
                    {column.cards.length}
                  </span>
                </div>
                <SortableContext
                  id={`kanban-01-${column.id}`}
                  items={column.cards.map((card) => card.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ColumnDrop
                    id={column.id}
                    empty={column.cards.length === 0}
                  >
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
              <div className="cursor-grabbing rounded-lg bg-background px-3 py-3 ring-1 ring-border">
                <CardBody card={activeCard} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </section>
  );
}
