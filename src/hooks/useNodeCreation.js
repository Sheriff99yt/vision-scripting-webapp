import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useNodeCreation = (setNodes, manageHistory) => {
  const createNode = useCallback((type, position) => {
    const newNode = {
      id: uuidv4(),
      type,
      position,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
    };
    setNodes((nds) => {
      const updatedNodes = nds.concat(newNode);
      manageHistory(updatedNodes, []);
      return updatedNodes;
    });
  }, [setNodes, manageHistory]);

  return createNode;
};