// src/components/mockFamilyData.ts

export const initialNodes = [
  {
    id: "1",
    position: { x: 400, y: 100 },
    data: { label: "Great-Grandpa Joe" },
    style: { background: '#97bb52', color: 'white', border: 'none', borderRadius: '8px', padding: '15px', fontWeight: 'bold' }
  },
  {
    id: "2",
    position: { x: 250, y: 250 },
    data: { label: "Uncle Marcus" },
    style: { background: '#161B07', color: 'white', border: '1px solid #97bb52', borderRadius: '8px', padding: '10px' }
  },
  {
    id: "3",
    position: { x: 550, y: 250 },
    data: { label: "Aunt Sarah" },
    style: { background: '#161B07', color: 'white', border: '1px solid #97bb52', borderRadius: '8px', padding: '10px' }
  },
  {
    id: "4",
    position: { x: 250, y: 400 },
    data: { label: "Cousin Jamal" },
    style: { background: '#2e413b', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' }
  }
];

export const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: '#97bb52' } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: '#97bb52' } },
  { id: "e2-4", source: "2", target: "4", animated: true, style: { stroke: '#97bb52' } },
];