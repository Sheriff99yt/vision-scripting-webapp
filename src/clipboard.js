export async function copy(nodes, edges) {
  try {
    if (!navigator.clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }

    const permission = await navigator.permissions.query({ name: 'clipboard-write' });
    if (permission.state === 'denied') {
      console.warn('Clipboard write permission denied');
      return false;
    }

    const boundingBox = calculateBoundingBox(nodes);
    const clipboardData = {
      nodes: nodes.map(node => ({
        ...node,
        position: { 
          x: node.position.x - boundingBox.minX,
          y: node.position.y - boundingBox.minY
        }
      })),
      edges: edges.filter(edge => 
        nodes.some(node => node.id === edge.source) && 
        nodes.some(node => node.id === edge.target)
      ),
      boundingBox: boundingBox
    };

    await navigator.clipboard.writeText(JSON.stringify(clipboardData));
    return true;
  } catch (err) {
    console.error('Failed to write to clipboard: ', err);
    return false;
  }
}

export async function cut(nodes, edges, updateFlow) {
  const success = await copy(nodes, edges);
  if (success) {
    const updatedNodes = nodes.filter(node => !nodes.some(n => n.id === node.id));
    const updatedEdges = edges.filter(edge => 
      !nodes.some(node => node.id === edge.source || node.id === edge.target)
    );
    updateFlow(updatedNodes, updatedEdges);
    return true;
  }
  return false;
}

export async function paste(mousePosition, viewport, updateFlow) {
  try {
    if (!navigator.clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }

    const permission = await navigator.permissions.query({ name: 'clipboard-read' });
    if (permission.state === 'denied') {
      console.warn('Clipboard read permission denied');
      return false;
    }

    const text = await navigator.clipboard.readText();
    const clipboardData = JSON.parse(text);

    if (!isValidClipboardData(clipboardData)) {
      console.warn('Invalid clipboard data');
      return false;
    }

    const { nodes: pastedNodes, edges: pastedEdges, boundingBox } = clipboardData;

    const pasteX = (mousePosition.x - viewport.x) / viewport.zoom;
    const pasteY = (mousePosition.y - viewport.y) / viewport.zoom;

    const offsetX = pasteX - boundingBox.minX;
    const offsetY = pasteY - boundingBox.minY;

    const newNodes = pastedNodes.map(node => ({
      ...node,
      id: generateUniqueId(),
      position: {
        x: node.position.x + offsetX,
        y: node.position.y + offsetY,
      },
    }));

    const idMap = pastedNodes.reduce((map, node, index) => {
      map[node.id] = newNodes[index].id;
      return map;
    }, {});

    const newEdges = pastedEdges.map(edge => ({
      ...edge,
      id: generateUniqueId(),
      source: idMap[edge.source],
      target: idMap[edge.target],
    }));

    updateFlow(prevNodes => [...prevNodes, ...newNodes], prevEdges => [...prevEdges, ...newEdges]);
    return true;
  } catch (err) {
    console.error('Failed to paste from clipboard: ', err);
    return false;
  }
}

function calculateBoundingBox(nodes) {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return nodes.reduce(
    (box, node) => ({
      minX: Math.min(box.minX, node.position.x),
      minY: Math.min(box.minY, node.position.y),
      maxX: Math.max(box.maxX, node.position.x),
      maxY: Math.max(box.maxY, node.position.y),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
}

function isValidClipboardData(data) {
  return (
    data &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.edges) &&
    typeof data.boundingBox === 'object' &&
    typeof data.boundingBox.minX === 'number' &&
    typeof data.boundingBox.minY === 'number' &&
    typeof data.boundingBox.maxX === 'number' &&
    typeof data.boundingBox.maxY === 'number'
  );
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}