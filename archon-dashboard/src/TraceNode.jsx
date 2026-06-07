import { Handle, Position } from "reactflow";
function TraceNode({ data }) {
  return (
    <div
      style={{
        border: "2px solid #333",
        borderRadius: "10px",
        padding: "12px",
        minWidth: "220px",
        background: "white",
        textAlign: "center"
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
      />

      <h4>{data.endpoint}</h4>

      <hr />

      <p>Requests: {data.requests}</p>

      <p>Avg: {data.avgDuration} ms</p>

      <p>Errors: {data.errors}</p>

      <Handle
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}

export default TraceNode;

