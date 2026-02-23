-- Migration: Ajuste definitivo para cálculo dinâmico (Venda = Fidelidade + % Empresa)
-- Created at: 2026-02-23

CREATE OR REPLACE FUNCTION public.fn_calculate_flyer_prices(p_flyer_id INT)
RETURNS VOID AS $$
BEGIN

    UPDATE promotional_flyer_products pfp
    SET
        sale_price    = calc.final_sale_price,
        loyalty_price = calc.final_loyalty_price,
        updated_at    = NOW() AT TIME ZONE 'utc'
    FROM (
        SELECT
            pfp_inner.promotional_flyer_id,
            pfp_inner.product_id,
            pfp_inner.company_id,

            ---------------------------------------------------------
            -- LÓGICA DO PREÇO FINAL (VENDA)
            ---------------------------------------------------------
            CASE
                WHEN vars.min_comp_price <= 0 THEN 0
                WHEN vars.final_cost >= vars.min_comp_price THEN 0
                WHEN settings.id IS NOT NULL
                     AND vars.min_comp_price < vars.loyalty_base_price
                THEN
                    CASE
                        WHEN COALESCE(pfp_inner.current_loyalty_price, 0) > 0
                            -- Aplica o % da empresa sobre o preço com desconto do concorrente
                            THEN ROUND(vars_discount.discounted_price * (1 + (COALESCE(cs.increase_price_percent, 0) / 100.0)), 2)
                        ELSE
                            ROUND(vars_discount.discounted_price, 2)
                    END
                ELSE
                    CASE
                        WHEN COALESCE(pfp_inner.current_loyalty_price, 0) > 0
                            -- Aplica o % da empresa sobre o preço fidelidade sugerido.
                            THEN ROUND(vars.loyalty_base_price * (1 + (COALESCE(cs.increase_price_percent, 0) / 100.0)), 2)
                        ELSE
                            ROUND(vars.loyalty_base_price, 2)
                    END
            END AS final_sale_price,

            ---------------------------------------------------------
            -- LÓGICA DO PREÇO FINAL (FIDELIDADE)
            ---------------------------------------------------------
            CASE
                WHEN vars.min_comp_price <= 0 THEN 0
                WHEN vars.final_cost >= vars.min_comp_price THEN 0
                WHEN COALESCE(pfp_inner.current_loyalty_price, 0) > 0
                THEN
                    CASE
                        WHEN settings.id IS NOT NULL
                             AND vars.min_comp_price < vars.loyalty_base_price
                        THEN
                            ROUND(vars_discount.discounted_price, 2)
                        ELSE
                            ROUND(vars.loyalty_base_price, 2)
                    END
                ELSE
                    0
            END AS final_loyalty_price

        FROM promotional_flyer_products pfp_inner
        JOIN promotional_flyers pf ON pf.id = pfp_inner.promotional_flyer_id
        LEFT JOIN company_settings cs ON cs.company_id = pfp_inner.company_id
        JOIN product_margin_branches pmb ON pmb.product_id = pfp_inner.product_id 
             AND pmb.company_id = pfp_inner.company_id 
             AND pmb.branche_id = pf.branche_id

        LEFT JOIN supplier_shipping_price ssp ON ssp.supplier_id = pfp_inner.quote_supplier_id
             AND ssp.product_id = pfp_inner.product_id
             AND ssp.company_id = pfp_inner.company_id

        JOIN LATERAL (
            SELECT COALESCE(MIN(cpfp.price), 0) AS price
            FROM competitor_price_flyer_products cpfp
            JOIN competitor_branches cb ON cb.competitor_id = cpfp.competitor_id AND cb.branche_id = pf.branche_id
            WHERE cpfp.product_id = pfp_inner.product_id 
              AND cpfp.integral_flyer_id = pf.id_integral
              AND cpfp.price > 0
        ) min_comp ON true

        JOIN LATERAL (
            SELECT
                (COALESCE(ssp.shipping_price, 0) + COALESCE(pfp_inner.quote_cost, 0)) AS final_cost,
                min_comp.price AS min_comp_price,
                --Preço Fidelidade: Custo + Margem do Produto
                ((COALESCE(ssp.shipping_price, 0) + COALESCE(pfp_inner.quote_cost, 0)) * (1 + (COALESCE(pmb.margin, 0) / 100.0))) AS loyalty_base_price
        ) vars ON true

        LEFT JOIN suggested_price_settings settings
            ON settings.company_id = pfp_inner.company_id
           AND ((1 - (vars.final_cost / NULLIF(vars.min_comp_price, 0))) * 100) BETWEEN settings.margin_min AND settings.margin_max

        JOIN LATERAL (
            SELECT vars.min_comp_price * (1 - (COALESCE(settings.discount_percent, 0) / 100.0)) AS discounted_price
        ) vars_discount ON true

        WHERE pfp_inner.promotional_flyer_id = p_flyer_id
          AND COALESCE(pfp_inner.lock_price, false) = false
    ) calc
    WHERE pfp.promotional_flyer_id = calc.promotional_flyer_id
      AND pfp.product_id = calc.product_id
      AND COALESCE(pfp.lock_price, false) = false;

END;
$$ LANGUAGE plpgsql;