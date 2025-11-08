type JourneyStep = {
  sessionId: string;
  userId: string;
  steps: string[];
};

type SankeyNode = {
  name: string;
  value: number;
  depth: number;
};

type SankeyLink = {
  source: number;
  target: number;
  value: number;
};

type SankeyData = {
  nodes: SankeyNode[];
  links: SankeyLink[];
};

export function convertJourneyToSankeyData(
  journeys: JourneyStep[],
): SankeyData {
  const nodeOrder = new Map<string, number>();
  const nodeCounts = new Map<string, number>();
  const linkCounts = new Map<string, number>();
  let currentIndex = 0;

  for (const journey of journeys) {
    const steps = journey.steps;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (!nodeOrder.has(step)) {
        nodeOrder.set(step, currentIndex++);
      }

      nodeCounts.set(step, (nodeCounts.get(step) || 0) + 1);

      if (i < steps.length - 1) {
        const next = steps[i + 1];

        if (step === next) continue;

        const key = `${step}->${next}`;
        linkCounts.set(key, (linkCounts.get(key) || 0) + 1);
      }
    }
  }

  // Build nodes (shift indices by 1 to make room for 'Start')
  const nodes: SankeyNode[] = [
    { name: "Start", value: 0, depth: 0 },
    ...Array.from(nodeOrder.entries()).map(([name, index]) => ({
      name,
      value: nodeCounts.get(name) ?? 1,
      depth: index + 1,
    })),
  ];

  const nodeNameToIndex = new Map(
    Array.from(nodeOrder.keys()).map((name, i) => [name, i + 1]),
  );

  const links: SankeyLink[] = Array.from(linkCounts.entries()).map(
    ([key, value]) => {
      const [sourceName, targetName] = key.split("->");
      return {
        source: nodeNameToIndex.get(sourceName)!,
        target: nodeNameToIndex.get(targetName)!,
        value,
      };
    },
  );

  const allTargets = new Set(links.map((link) => link.target));
  const startLinks: SankeyLink[] = [];
  for (const [name, idx] of nodeNameToIndex.entries()) {
    if (!allTargets.has(idx)) {
      startLinks.push({
        source: 0,
        target: idx,
        value: nodeCounts.get(name) ?? 1,
      });
      nodes[0].value += nodeCounts.get(name) ?? 1;
    }
  }

  return { nodes, links: [...startLinks, ...links] };
}
