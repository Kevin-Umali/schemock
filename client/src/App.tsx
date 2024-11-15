import { useRef, useState } from "react";
import { TreeNode } from "@/types/tree";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LOCALES } from "@/constants";
import { convertToSchema } from "@/lib/schema";
import TreeView from "./components/custom/tree-view";

const App = () => {
  const idCounter = useRef(0);

  // Generate a unique ID using the counter
  const generateUniqueId = () => {
    idCounter.current += 1; // Increment the counter
    return `node-${idCounter.current}`; // Return a prefixed unique ID
  };

  const [nodes, setNodes] = useState<TreeNode[]>([
    {
      id: generateUniqueId(),
      name: "user",
      type: "object",
      isRoot: true,
      children: [
        {
          id: generateUniqueId(),
          name: "name",
          type: "string",
          fakerMethod: "person.firstName",
          isRoot: false,
        },
        {
          id: generateUniqueId(),
          name: "email",
          type: "string",
          fakerMethod: "internet.email",
          isRoot: false,
        },
        {
          id: generateUniqueId(),
          name: "address",
          type: "object",
          isRoot: false,
          children: [
            {
              id: generateUniqueId(),
              name: "street",
              type: "string",
              fakerMethod: "location.streetAddress",
              isRoot: false,
            },
            {
              id: generateUniqueId(),
              name: "city",
              type: "string",
              fakerMethod: "location.city",
              isRoot: false,
            },
            {
              id: generateUniqueId(),
              name: "country",
              type: "string",
              fakerMethod: "location.country",
              isRoot: false,
            },
          ],
        },
      ],
    },
  ]);

  const [count, setCount] = useState(1);
  const [locale, setLocale] = useState("en");

  console.log("nodes:", nodes);

  const addRootNode = () => {
    const newRootId = generateUniqueId();

    setNodes([
      ...nodes,
      {
        id: newRootId,
        name: "newRoot",
        type: "object",
        isRoot: true,
        children: [],
      },
    ]);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="count">Count:</label>
          <Input id="count" type="number" min={1} max={100} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="w-20" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="locale">Locale:</label>
          <Select value={locale} onValueChange={setLocale}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Locale" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {LOCALES.map((locale) => (
                  <SelectItem key={locale} value={locale}>
                    {locale}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <button onClick={addRootNode} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Add Root Node
        </button>

        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Generate</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Schema Builder</h2>
          <TreeView nodes={nodes} onChange={setNodes} allowAdd allowDelete defaultExpanded />
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Generated Schema</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px]">
            {JSON.stringify(
              {
                ...convertToSchema(nodes),
                count,
                locale,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;
