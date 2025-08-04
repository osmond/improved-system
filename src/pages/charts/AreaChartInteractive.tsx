import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import { useChartActions } from "@/hooks/useChartActions";

export default function AreaChartInteractivePage() {
  const { setActions } = useChartActions();

  React.useEffect(() => {
    function handleSaveView() {
      alert("View saved");
    }

    async function handleShare() {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      } catch {
        alert("Copy failed");
      }
    }

    function handleExport() {
      window.print();
    }

    setActions({
      onSaveView: handleSaveView,
      onShare: handleShare,
      onExport: handleExport,
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
