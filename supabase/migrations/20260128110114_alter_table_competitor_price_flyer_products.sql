alter table competitor_price_flyer_products
add promotional_flyer_id bigint not null;

alter table competitor_price_flyer_products
add constraint fk_competitor_price_flyer_product
foreign key (promotional_flyer_id, product_id, company_id)
references promotional_flyer_products
(promotional_flyer_id, product_id, company_id)
on delete cascade;
