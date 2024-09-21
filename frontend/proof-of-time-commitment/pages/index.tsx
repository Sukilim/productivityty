import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

// DnD imports
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { Inter } from 'next/font/google';

// Components
import Container from '@/components/Container';
import Items from '@/components/Item';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { Button } from '@/components/Button';

const inter = Inter({ subsets: ['latin'] });

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
  }[];
};

export default function Home() {
  const [containers, setContainers] = useState<DNDType[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
  const [containerName, setContainerName] = useState('');
  const [itemName, setItemName] = useState(''); // For the item name
  const [assigned, setAssigned] = useState(''); // For the person assigned to the task
  const [storyPoints, setStoryPoints] = useState(0); // For the story points
  const [description, setDescription] = useState('');
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showItemDetailModal, setShowItemDetailModal] = useState(false); // New state for item detail modal
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string } | null>(null); // New state for selected item

  const [userRole, setUserRole] = useState<'worker' | 'manager'>('manager'); // Defaulting to 'manager' for now
  const [showHereModal, setShowHereModal] = useState(false);

  // New state for dropdown
  const [selectedOption, setSelectedOption] = useState('option1');

  // Handler for dropdown
  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (containers.length === 0) {
      const initialContainers = [
        { title: 'To-Do', id: `container-${uuidv4()}`, items: [] },
        { title: 'In-Progress', id: `container-${uuidv4()}`, items: [] },
        { title: 'In-Review', id: `container-${uuidv4()}`, items: [] },
        { title: 'Done', id: `container-${uuidv4()}`, items: [] },
      ];
      setContainers(initialContainers);
    }
  }, [containers]);

  const onAddContainer = () => {
    if (!containerName) return;
    const id = `container-${uuidv4()}`;
    setContainers([
      ...containers,
      {
        id,
        title: containerName,
        items: [],
      },
    ]);
    setContainerName('');
    setShowAddContainerModal(false);
  };

  const handleItemClick = (itemId: string) => {
    const container = containers.find(container =>
      container.items.some(item => item.id === itemId),
    );
    const item = container?.items.find(item => item.id === itemId);
    if (item) {
      setSelectedItem(item);
      setShowItemDetailModal(true);
    }
  }

  useEffect(() => {
    if (containers.length === 0) {
      const initialContainers = [
        { title: 'To-Do', id: `container-${uuidv4()}`, items: [] },
        { title: 'In-Progress', id: `container-${uuidv4()}`, items: [] },
        { title: 'In-Review', id: `container-${uuidv4()}`, items: [] },
        { title: 'Done', id: `container-${uuidv4()}`, items: [] },
      ];
      setContainers(initialContainers);
    }
  }, [containers]);

  const onAddItem = () => {
    if (!itemName) return;
  
    const id = `item-${uuidv4()}`;
    const containerIndex = containers.findIndex((item) => item.id === currentContainerId);
  
    if (containerIndex === -1) return; // If container is not found, return early
  
    // Create a new item
    const newItem = {
      id,
      title: itemName,
      description: description,
      story_points: storyPoints,
      assigned: assigned,
    };
  
    // Create a new containers array by spreading the current array
    const newContainers = [...containers];
  
    // Create a new items array for the current container
    const updatedItems = [...newContainers[containerIndex].items, newItem];
  
    // Update the container with the new items array
    newContainers[containerIndex] = {
      ...newContainers[containerIndex],
      items: updatedItems,
    };
  
    // Update the state with the new containers array
    setContainers(newContainers);
  
    // Reset form fields
    setItemName('');
    setAssigned('');
    setStoryPoints(0);
    setDescription('');
    setShowAddItemModal(false);
  };
  


  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'container') {
      return containers.find((item) => item.id === id);
    }
    if (type === 'item') {
      return containers.find((container) =>
        container.items.find((item) => item.id === id),
      );
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.title;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return '';
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return [];
    return container.items;
  };


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    
    setActiveId(id);
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );

      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex,
        );

        setContainers(newItems);
      } else {
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem,
        );
        setContainers(newItems);
      }
    }

    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (
      active.id.toString().includes('container') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id,
      );
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      if (!activeContainer || !overContainer) return;
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );

      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex,
        );
        setContainers(newItems);
      } else {
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem,
        );
        setContainers(newItems);
      }
    }

    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
    setActiveId(null);
  }

  return (
    <div className="mx-auto max-w-7xl p-10">
      {/* Add Item Modal */}
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-gray-800 text-3xl font-bold mb-4">Add Item</h1>

          <form className="w-full flex flex-col gap-y-4">
            <div className="flex flex-col">
              <label htmlFor="title" className="text-gray-600">Title</label>
              <input
                id="title"
                type="text"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={itemName}  // Binds the input to the itemName state
                onChange={(e) => setItemName(e.target.value)}  // Updates state on input change
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="text-gray-600">Description</label>
              <textarea
                id="description"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}  // Binds the textarea to the description state
                onChange={(e) => setDescription(e.target.value)}  // Updates state on change
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="story_points" className="text-gray-600">Story Points</label>
              <input
                id="story_points"
                type="number"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={storyPoints}  // Binds the input to the storyPoints state
                onChange={(e) => setStoryPoints(Number(e.target.value))}  // Updates state on change
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="assigned" className="text-gray-600">Assigned To</label>
              <input
                id="assigned"
                type="text"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={assigned}  // Binds the input to the assigned state
                onChange={(e) => setAssigned(e.target.value)}  // Updates state on change
              />
            </div>
          </form>

            <Button onClick={onAddItem} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Add Item
            </Button>
        </div>
      </Modal>

  
      <Modal showModal={showItemDetailModal} setShowModal={setShowItemDetailModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Item Details</h1>
          {selectedItem && (
            <div>
        <p><strong>Title:</strong> {selectedItem.title}</p>
        <p><strong>Description:</strong> {selectedItem.description}</p>
        <p><strong>Story Points:</strong> {selectedItem.story_points}</p>
        <p><strong>Assigned:</strong> {selectedItem.assigned}</p>
        </div>
          )}
          <button
            onClick={() => setShowItemDetailModal(false)}
            className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </Modal>
  
      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-gray-800 text-3xl font-bold">CrytoTask</h1>
  
        {/* Dropdown */}
        <select
          value={selectedOption}
          onChange={handleDropdownChange}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <DynamicWidget />
      </div>
  
      <div className="mt-10">
        {userRole === 'manager' ? (
          <div className="grid grid-cols-4 gap-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={containers.map((i) => i.id)}>
                {containers.map((container) => (
                  <Container
                    id={container.id}
                    title={container.title}
                    key={container.id}
                    onAddItem={() => {
                      if (userRole === 'manager') { // Only managers can add items
                        setShowAddItemModal(true);
                        setCurrentContainerId(container.id);
                      }
                    }}
                    userRole={userRole}
                  >
                    <SortableContext items={container.items.map((i) => i.id)}>
                      <div className="flex items-start flex-col gap-y-4">
                        {container.items.map((i) => (
                          <Items title={i.title} id={i.id} key={i.id} onClick={() => handleItemClick(i.id)} />
                        ))}
                      </div>
                    </SortableContext>
                  </Container>
                ))}
              </SortableContext>
  
              <DragOverlay adjustScale={false}>
                {activeId && activeId.toString().includes('item') && (
                  <Items id={activeId} title={findItemTitle(activeId)} onClick={() => handleItemClick(activeId)} />
                )}
                {activeId && activeId.toString().includes('container') && (
                  <Container id={activeId} userRole={userRole} title={findContainerTitle(activeId)}>
                    {findContainerItems(activeId).map((i) => (
                      <Items key={i.id} title={i.title} id={i.id} onClick={() => handleItemClick(i.id)} />
                    ))}
                  </Container>
                )}
              </DragOverlay>
            </DndContext>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={containers
                .filter(container => container.title !== 'To-Do') // Exclude 'To-Do' for non-managers
                .map((i) => i.id)
              }>
                {containers
                  .filter(container => container.title !== 'To-Do') // Exclude 'To-Do' for non-managers
                  .map((container) => (
                    <Container
                      id={container.id}
                      title={container.title}
                      key={container.id}
                      onAddItem={() => {
                        if (userRole === 'manager') { // Only managers can add items
                          setShowAddItemModal(true);
                          setCurrentContainerId(container.id);
                        }
                      }}
                      userRole={userRole}
                    >
                      <SortableContext items={container.items.map((i) => i.id)}>
                        <div className="flex items-start flex-col gap-y-4">
                          {container.items.map((i) => (
                            <Items title={i.title} id={i.id} key={i.id} onClick={() => handleItemClick(i.id)} />
                          ))}
                        </div>
                      </SortableContext>
                    </Container>
                  ))}
              </SortableContext>
  
              <DragOverlay adjustScale={false}>
                {activeId && activeId.toString().includes('item') && (
                  <Items id={activeId} title={findItemTitle(activeId)} onClick={() => handleItemClick(activeId)} />
                )}
                {activeId && activeId.toString().includes('container') && (
                  <Container id={activeId} userRole={userRole} title={findContainerTitle(activeId)}>
                    {findContainerItems(activeId).map((i) => (
                      <Items key={i.id} title={i.title} id={i.id} onClick={() => handleItemClick(i.id)} />
                    ))}
                  </Container>
                )}
              </DragOverlay>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
  
}
