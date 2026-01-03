/**
 * PageHeader - Reusable page header with title and description
 */

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
      <div>
        <h1 
          className="text-[#1F1B2E] mb-1" 
          style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
