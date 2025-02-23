
export const ApplicationSection = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Application</h3>
      <div className="space-y-2">
        {["Tissue Engineering", "Drug Delivery", "Biomaterials", "Environmental remediation"].map((app) => (
          <label key={app} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            <span className="ml-2 text-sm text-gray-600">{app}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

