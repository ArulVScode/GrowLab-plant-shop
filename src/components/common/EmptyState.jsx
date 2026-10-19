export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-20 h-20 flex items-center justify-center border-3 border-ink bg-cream shadow-hard mb-5">
          <Icon size={36} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-xl mb-2">{title}</h3>
      {description && <p className="text-muted max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
