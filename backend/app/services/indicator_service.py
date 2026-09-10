def calculate_indicators(
    planned_days,
    budget_pen,
    kloc,
    actual_days_pred,
    actual_cost_pred,
    defects_pred
):

    # ========================================================
    # RETRASO
    # ========================================================

    retraso_porcentaje = (
        (
            actual_days_pred - planned_days
        )
        /
        planned_days
    ) * 100


    # ========================================================
    # SOBRECOSTO
    # ========================================================

    sobrecosto_porcentaje = (
        (
            actual_cost_pred - budget_pen
        )
        /
        budget_pen
    ) * 100


    # ========================================================
    # DENSIDAD DE DEFECTOS
    # ========================================================

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
