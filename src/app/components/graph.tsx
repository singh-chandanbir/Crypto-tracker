import React, { useEffect, useRef, useState } from "react";
import { WalletData, Transaction } from "@/backend/walletHistorySubscan";
import { DataSet, Network, Data, Node, Edge } from "vis-network/standalone";

interface GraphProps {
  walletID: string;
  walletData: WalletData;
}

const Graph: React.FC<GraphProps> = ({ walletID, walletData }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [networkInstance, setNetworkInstance] = useState<Network | null>(null);

  const buildNodesAndEdges = (transactions: Transaction[]) => {
    const nodesMap = new Map<string, number>();
    const nodesData: Node[] = [];
    const edgesData: Edge[] = [];

    let currentId = 0;

    transactions.forEach((transaction) => {
      const { fromAddress, toAddress } = transaction;

      if (!nodesMap.has(fromAddress)) {
        nodesMap.set(fromAddress, currentId);
        nodesData.push({
          id: currentId,
          label: fromAddress.slice(0, 5),
          color: "#3f3f3f",
        });
        currentId++;
      }

      if (toAddress) {
        if (!nodesMap.has(toAddress)) {
          nodesMap.set(toAddress, currentId);
          nodesData.push({
            id: currentId,
            label: toAddress.slice(0, 5),
            color: "#e37e19",
          });
          currentId++;
        }
        edgesData.push({
          from: nodesMap.get(fromAddress)!,
          to: nodesMap.get(toAddress)!,
        });
      }
    });

    return { nodesData, edgesData };
  };

  useEffect(() => {
    if (networkRef.current) {
      const { nodesData, edgesData } = buildNodesAndEdges(walletData.transactions);

      // Create DataSet instances
      const nodes = new DataSet(nodesData);
      const edges = new DataSet(edgesData);

      // Network data
      const data: Data = {
        nodes: nodes,
        edges: edges,
      };

      // Network options
      const options = {
        layout: {
          hierarchical: false,
        },
        nodes: {
          color: "#3f3f3f",
          borderWidth: 2,
          borderColor: "#db00ff",
          font: {
            color: "#ffffff",
          },
          size: 100, // Set the default node size
          shape: "circle",
        },
        edges: {
          color: "#ffffff",
        },
        interaction: {
          zoomView: true, // Enable zoom
        },
        height: "100%",
        width: "100%",
        physics: {
          barnesHut: {
            gravitationalConstant: -5000,
            springLength: 150,
            springConstant: 0.005,
          },
          minVelocity: 0.75,
        },
      };

      const container = networkRef.current;
      const network = new Network(container, data, options);
      setNetworkInstance(network);

      network.on("selectNode", (event) => {
        const nodeId = event.nodes[0];
        if (nodeId) {
          // Update the color of the selected node
          nodes.update({ id: nodeId, color: "#db00ff" });

          // Move to the selected node
          const position = network.getPositions()[nodeId];
          network.moveTo({
            position,
            scale: 1.5,
            animation: {
              duration: 1000,
              easingFunction: "easeInOutQuad",
            },
          });

          // Reset the color of all other nodes
          nodes.get().forEach((node) => {
            if (node.id !== nodeId) {
              nodes.update({ id: node.id, color: "#3f3f3f" });
            }
          });

          // Apply glow effect to selected node
          document
            .querySelectorAll(".vis-network .vis-node")
            .forEach((nodeElement) => {
              const elementId = parseInt(
                nodeElement.getAttribute("nodeid") || "",
              );
              if (elementId !== nodeId) {
                (nodeElement as HTMLElement).style.boxShadow = "";
              }
            });

          const selectedNodeElement = document.querySelector(
            `.vis-network .vis-node[nodeid="${nodeId}"]`,
          );
          if (selectedNodeElement) {
            (selectedNodeElement as HTMLElement).style.boxShadow =
              "0 0 10px 5px rgba(219, 0, 255, 0.7)";
          }
        }
      });

      network.on("dragEnd", () => {
        // Snap back to the selected node if there is one
        if (selectedNodeId !== null) {
          const position = network.getPositions()[selectedNodeId];
          network.moveTo({
            position,
            scale: 1.5,
            animation: {
              duration: 1000,
              easingFunction: "easeInOutQuad",
            },
          });
        }
      });

      return () => {
        network.destroy();
      };
    }
  }, [walletID, walletData, selectedNodeId]);

  return (
    <div
      ref={networkRef}
      style={{ width: "80%", height: "600px", border: "1px solid #db00ff",margin:"auto" }}
    />
  );
};

export default Graph;