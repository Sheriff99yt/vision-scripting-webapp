import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useNodeCreation = (updateFlow, nodes, edges) => {
  const createNode = useCallback((type, position) => {
    const newNode = {
      id: uuidv4(),
      type,
      position,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
    };

    updateFlow([...nodes, newNode], edges);
  }, [updateFlow, nodes, edges]);

  return createNode;
};