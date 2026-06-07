import TraceNode from "./TraceNode";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactFlow, {
  Background,
  Controls
} from "reactflow";

import "reactflow/dist/style.css";

const nodeTypes = {
  traceNode: TraceNode
};

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

 useEffect(() => {
  fetchTraces();

  const interval = setInterval(
    fetchTraces,
    3000
  );

  return () =>
    clearInterval(interval);

}, []);

  const fetchTraces = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/traces"
      );

      const traces = res.data;

      const graphNodes = [];
      const graphEdges = [];

      const services = [
        ...new Set(
          traces.map(
            (trace) => trace.service
          )
        )
      ];

      services.forEach(
        (service, serviceIndex) => {

          // Service Node
          graphNodes.push({
            id: service,

            position: {
              x: 300 * serviceIndex,
              y: 50
            },

            data: {
              label: service
            }
          });

          const serviceEndpoints =
            traces.filter(
              (trace) =>
                trace.service === service
            );

          const uniqueEndpoints = [
            ...new Set(
              serviceEndpoints.map(
                (trace) =>
                  trace.endpoint
              )
            )
          ];

          uniqueEndpoints.forEach(
            (
              endpoint,
              endpointIndex
            ) => {

              const endpointId =
                service + endpoint;

              const endpointTraces =
                serviceEndpoints.filter(
                  (trace) =>
                    trace.endpoint === endpoint
                );

              const requests =
                endpointTraces.length;

              const avgDuration =
                Math.round(
                  endpointTraces.reduce(
                    (sum, trace) =>
                      sum + trace.duration,
                    0
                  ) / requests
                );

              const errors =
                endpointTraces.filter(
                  (trace) =>
                    trace.status >= 400
                ).length;

              graphNodes.push({
                id: endpointId,

                type: "traceNode",

                position: {
                  x: 100 + endpointIndex * 350,
                  y: 250
                },

                data: {
                  endpoint,
                  requests,
                  avgDuration,
                  errors
                }
              });

              graphEdges.push({
                id:
                  service +
                  "-" +
                  endpoint,

                source: service,

                target: endpointId
              });

            }
          );

        }
      );

      setNodes(graphNodes);
      setEdges(graphEdges);

    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div
    style={{
      width: "100vw",
      height: "100vh"
    }}
  >
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
    >
      <Background />
      <Controls />
    </ReactFlow>
  </div>
);
}

export default App;