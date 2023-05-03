import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui";

export const SideNavigation = () => {
  return (
    <Tabs defaultValue="peaks" className="p-2 h-full w-96">
      <TabsList>
        <TabsTrigger value="peaks">Peaks</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>
      <TabsContent value="peaks" className="space-y-2 h-full overflow-y-auto">
        <div className="flex flex-col gap-2">
          <img
            className="rounded"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          />
          <div>
            <h2 className="text-2xl">Lorem ipsum</h2>
            <p className="text-sm text-gray-500">0/214 complete</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <img
            className="rounded"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          />
          <div>
            <h2 className="text-2xl">Lorem ipsum</h2>
            <p className="text-sm text-gray-500">0/214 complete</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <img
            className="rounded"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          />
          <div>
            <h2 className="text-2xl">Lorem ipsum</h2>
            <p className="text-sm text-gray-500">0/214 complete</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <img
            className="rounded"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          />
          <div>
            <h2 className="text-2xl">Lorem ipsum</h2>
            <p className="text-sm text-gray-500">0/214 complete</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="timeline" className="space-y-2 overflow-y-auto">
        Timeline
      </TabsContent>
    </Tabs>
  );
};
