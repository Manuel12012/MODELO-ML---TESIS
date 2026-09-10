function StatCard({
    title,
    value,
    icon,
    color = "blue",
  }) {
    const colorStyles = {
      blue: {
        container: "bg-blue-50 text-blue-600",
      },
      green: {
        container: "bg-emerald-50 text-emerald-600",
      },
      orange: {
        container: "bg-orange-50 text-orange-600",
      },
      red: {
        container: "bg-red-50 text-red-600",
      },
      purple: {
        container: "bg-purple-50 text-purple-600",
      },
    };
  
    const selectedColor =
      colorStyles[color] || colorStyles.blue;
  
    return (
      <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
  
        <div className="flex items-start justify-between gap-4">
  
          {/* =====================================================
              INFORMACIÓN
          ====================================================== */}
  
          <div className="min-w-0">
  
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>
  
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </p>
  
          </div>
  
  
          {/* =====================================================
              ICONO
          ====================================================== */}
  
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${selectedColor.container} transition-transform duration-200 group-hover:scale-105`}
          >
            {icon}
          </div>
  
        </div>
  
      </div>
    );
  }
  
  export default StatCard;