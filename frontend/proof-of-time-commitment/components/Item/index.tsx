import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  description: string;
  story_points: number;
  assigned: string;

  onClick?: () => void; // Optional onClick handler if you want to handle clicks
};

const Items = ({ id, title, onClick }: ItemsType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={clsx(
        'px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer',
        isDragging && 'opacity-50',
      )}
      onClick={onClick} // Handles clicks if an onClick handler is passed
    >
      <div className="flex items-center justify-between">
        <span>{title}</span>
        <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
          aria-label="Drag item"
        >
          Drag Handle
        </button>
      </div>
    </div>
  );
};

export default Items;
