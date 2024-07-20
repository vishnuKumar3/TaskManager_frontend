// App.js
import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import SortableItem from './SortableItem';


export default function DNDComponent(props) {
  const [items, setItems] = useState(props.items);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    console.log('Drag started:', event);
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    console.log('Drag ended:', event);
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleDragOver = (event) => {
    console.log('Drag over:', event);
  };

  const handleDragMove = (event) => {
    console.log('Drag move:', event);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
    >
      <SortableContext items={items}>
        <div style={{ width: '200px', margin: '0 auto' }}>
          {items.map((id) => (
            <SortableItem key={id} id={id} isOver={id === activeId} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}