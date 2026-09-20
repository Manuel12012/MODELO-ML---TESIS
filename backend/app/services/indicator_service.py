def calculate_indicators(
    planned_days,
    budget_pen,
    kloc,
    actual_days_pred,
    actual_cost_pred,
    defects_pred
):

    # Convertimos todos los valores numéricos a float
    # para evitar conflictos entre Decimal y float.
    planned_days = float(planned_days)
    budget_pen = float(budget_pen)
    kloc = float(kloc)
    actual_days_pred = float(actual_days_pred)
    actual_cost_pred = float(actual_cost_pred)
    defects_pred = float(defects_pred)

    # Indicador de cumplimiento del tiempo
    retraso_porcentaje = (
        (actual_days_pred - planned_days)
        / planned_days
    ) * 100

    # Indicador de cumplimiento del presupuesto
    sobrecosto_porcentaje = (
        (actual_cost_pred - budget_pen)
        / budget_pen
    ) * 100

    # Indicador de calidad del software
    densidad_defectos = (
        defects_pred / kloc
    )

    return {
        "retraso_porcentaje": float(
            retraso_porcentaje
        ),
        "sobrecosto_porcentaje": float(
            sobrecosto_porcentaje
        ),
        "densidad_defectos": float(
            densidad_defectos
        )
    }