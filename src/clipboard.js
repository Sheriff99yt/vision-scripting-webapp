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

    const clipboardData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: { x: node.position.x, y: node.position.y },
        data: node.data
      })),
      edges: edges,
      boundingBox: calculateBoundingBox(nodes)
    };

    await navigator.clipboard.writeText(JSON.stringify(clipboardData));
    return true;
  } catch (err) {
    console.error('Failed to write to clipboard: ', err);
    return false;
  }
}

export async function paste() {
  try {
    if (!navigator.clipboard) {
      console.warn('Clipboard API not available');
      return null;
    }

    const permission = await navigator.permissions.query({ name: 'clipboard-read' });
    if (permission.state === 'denied') {
      console.warn('Clipboard read permission denied');
      return null;
    }

    const text = await navigator.clipboard.readText();
    const clipboardData = JSON.parse(text);

    if (!isValidClipboardData(clipboardData)) {
      console.warn('Invalid clipboard data');
      return null;
    }

    return clipboardData;
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
    return null;
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