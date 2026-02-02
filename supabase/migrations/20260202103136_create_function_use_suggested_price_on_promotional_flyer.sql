CREATE OR REPLACE FUNCTION apply_suggested_prices(p_flyer_id BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE promotional_flyer_products pfp
    SET
        sale_price = calc.calculated_sale,
        loyalty_price = calc.calculated_loyalty,
        updated_at = NOW() AT TIME ZONE 'utc'
    FROM (
        SELECT
            pfp_inner.promotional_flyer_id,
            pfp_inner.product_id,
            pfp_inner.company_id,
            min_comp.price * (1 - (settings.discount_percent / 100.0)) AS calculated_sale,
            (min_comp.price * (1 - (settings.discount_percent / 100.0))) * 0.85 AS calculated_loyalty
        FROM promotional_flyer_products pfp_inner
        JOIN promotional_flyers pf
            ON pf.id = pfp_inner.promotional_flyer_id
        JOIN product_margin_branches pmb
            ON pmb.product_id = pfp_inner.product_id
           AND pmb.company_id = pfp_inner.company_id
           AND pmb.branche_id = pf.branche_id
        JOIN LATERAL (
            SELECT MIN(price) AS price
            FROM competitor_price_flyer_products
            WHERE product_id = pfp_inner.product_id
              AND promotional_flyer_id = p_flyer_id
              AND company_id = pfp_inner.company_id
              AND price > 0
        ) min_comp ON true
        JOIN LATERAL (
            SELECT s.discount_percent
            FROM suggested_price_settings s
            WHERE s.company_id = pfp_inner.company_id
              AND pmb.margin BETWEEN s.margin_min AND s.margin_max
            LIMIT 1
        ) settings ON true

        WHERE pfp_inner.promotional_flyer_id = p_flyer_id
          AND min_comp.price > 0
          AND (
              (min_comp.price - (COALESCE(pfp_inner.shipping_price, 0)
                               + COALESCE(pfp_inner.quote_cost, 0)))
              / min_comp.price * 100
          ) < pmb.margin
    ) calc
    WHERE pfp.promotional_flyer_id = calc.promotional_flyer_id
      AND pfp.product_id = calc.product_id
      AND pfp.company_id = calc.company_id;
END;
$$ LANGUAGE plpgsql;
