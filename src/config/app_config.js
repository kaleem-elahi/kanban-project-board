/**
 * Some default settings which can be managed through changing this config file.
 */
import {database} from './firebase_config';
let config = {
    currency_symbol: "€",
    currency_symbol_position: "pre",
    default_product_auction_time: 3,
    default_profit_margin: 20,
    max_image_per_product: 5,
    product_interval_time: 5,
    slot_size: 3
};

database.ref('/settings/').on('value', (snapshot) => {
    const settings = snapshot.val();
    config = Object.assign(config, settings);
});

export const currancyValueSeparator = "";

export const productLIstHeaderTooltips = { //Tooltips to show on header column of product listing page
    "name" : "Product Name",
    "qty" : "Quantity available in stock",
    "rrp" : "Recommended Retail Price",
    "lsp" : "Lowest selling price",
    "cog" : "Cost of goods",
    "peer_pressure" : "Default peer pressure"
};
export const orderListHeaderTooltips = { //Tooltips to show on header column of product listing page
    "name" : "Product Name",
    "date" : "Quantity available in stock",
    "amount" : "Amount"
};
export default config;