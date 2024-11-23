import { useMemo, useRef, useState } from "react";
import { TreeNode } from "@/types/tree";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { INITIAL_SCHEMA, LOCALES } from "@/constants";
import { convertToSchema } from "@/lib/schema";
import TreeView from "@/components/custom/tree-view";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

const App = () => {
  const [copiedText, copy] = useCopyToClipboard();
  const idCounter = useRef(7); // Start after initial schema IDs

  const [nodes, setNodes] = useState<TreeNode[]>(INITIAL_SCHEMA);
  const [count, setCount] = useState(1);
  const [locale, setLocale] = useState("en");

  const generatedSchema = useMemo(() => {
    return {
      ...convertToSchema(nodes),
      count,
      locale,
    };
  }, [nodes, count, locale]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCount(value > 0 && value <= 100 ? value : 1);
  };

  const handleCopy = async () => {
    const schemaString = JSON.stringify(generatedSchema, null, 2);
    await copy(schemaString);
  };

  const addRootNode = () => {
    idCounter.current += 1;
    setNodes((prev) => [
      ...prev,
      {
        id: `node-${idCounter.current}`,
        name: "newRoot",
        type: "object",
        isRoot: false,
        children: [],
      },
    ]);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="count" className="text-sm font-medium text-gray-700">
              Count:
            </label>
            <Input
              id="count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={handleCountChange}
              className="w-24 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="locale" className="text-sm font-medium text-gray-700">
              Locale:
            </label>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger className="w-40 transition-all duration-200 ease-in-out hover:border-blue-500">
                <SelectValue placeholder="Select Locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {LOCALES.map((loc) => (
                    <SelectItem key={loc} value={loc} className="transition-colors duration-150 ease-in-out hover:bg-blue-50">
                      {loc}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addRootNode} className="ml-auto transition-all duration-200 ease-in-out hover:shadow-md" variant="outline">
            Add Root Node
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schema Builder</h2>
          <div className="transition-all duration-300 ease-in-out">
            <TreeView nodes={nodes} onChange={setNodes} allowAdd allowDelete defaultExpanded />
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Generated Schema</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2 relative w-24 justify-center transition-all duration-200 ease-in-out hover:shadow-md"
            >
              <div
                className={cn(
                  "flex items-center gap-2 absolute transition-all duration-300 ease-in-out transform",
                  copiedText ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              >
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500 text-sm">Copied!</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 absolute transition-all duration-300 ease-in-out transform",
                  copiedText ? "scale-0 opacity-0" : "scale-100 opacity-100"
                )}
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </div>
            </Button>
          </div>
          <pre className={cn("bg-gray-50 p-4 rounded-md text-sm transition-all duration-300 ease-in-out hover:shadow-inner")}>
            {JSON.stringify(generatedSchema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;
