type GearListProps = {
  params: { id: string };
};

export default function GearList({ params }: GearListProps) {
  return <div>Gear List - {params.id}</div>;
}
