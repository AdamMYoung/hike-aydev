import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui";
import { PeaksNavigation } from "./peaks-navigation/peaks-navigation";

export const SideNavigation = () => {
  return (
    <Tabs defaultValue="peaks" className="relative h-full overflow-y-auto">
      <div className="px-4 py-2 z-10 sticky top-0 bg-white shadow">
        <TabsList>
          <TabsTrigger value="peaks">Peaks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="peaks">
        <PeaksNavigation />
      </TabsContent>
      <TabsContent value="timeline">
        <div>Test</div>
      </TabsContent>
      <TabsContent value="integrations">
        <div>Test</div>
      </TabsContent>
    </Tabs>
  );
};
