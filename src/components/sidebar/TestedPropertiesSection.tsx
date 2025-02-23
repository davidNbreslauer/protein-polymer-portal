
export const TestedPropertiesSection = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Tested Properties</h3>
      <div className="space-y-2">
        {["Cell viability", "Structural conformation", "Self-assembly", "Metal binding"].map((prop) => (
          <label key={prop} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            <span className="ml-2 text-sm text-gray-600">{prop}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

