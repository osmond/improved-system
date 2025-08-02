import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import { useChartActions } from "@/hooks/useChartActions";

export default function AreaChartInteractivePage() {
  const { setActions } = useChartActions();

  React.useEffect(() => {
    setActions({
      onSaveView: () => console.log("Save view"),
      onShare: () => console.log("Share"),
      onExport: () => console.log("Export"),
      info: "Interactive area chart example",
    });
    return () => setActions({});
  }, [setActions]);

  return (
    <div className="p-4">
      <AreaChartInteractive />
    </div>
  );
}
