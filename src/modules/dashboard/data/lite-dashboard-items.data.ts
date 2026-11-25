/**
 * LITE Dashboard Items Data Source
 *
 * Defines the complete items dictionary and catalog for Haatza LITE quick-commerce.
 * Contains:
 * - 7 legacy Category 201 widgets (sequences 1 to 7)
 * - 22 category widgets across Categories 202 to 212 (sequences 1 and 2 per category)
 * - 5 Dark-store warehouses constant
 * - Complete 29-widget block template replicated across 5 warehouses and 2 placements (290 rows total)
 */

import {
  LITE_ALL_CATEGORY_ID,
  LITE_FRUITS_VEGETABLES_CATEGORY_ID,
  LITE_DAILY_BREAKFAST_CATEGORY_ID,
  LITE_SNACKS_BEVERAGES_CATEGORY_ID,
  LITE_HOUSEHOLD_CLEANING_CATEGORY_ID,
  LITE_PERSONAL_CARE_CATEGORY_ID,
  LITE_KITCHEN_ESSENTIALS_CATEGORY_ID,
  LITE_BAKERY_BREADS_CATEGORY_ID,
  LITE_STAPLES_COOKING_CATEGORY_ID,
  LITE_FROZEN_FOODS_CATEGORY_ID,
  LITE_BABY_CARE_CATEGORY_ID,
  LITE_PET_SUPPLIES_CATEGORY_ID,
  LITE_FRUITS_AND_VEGETABLES_CATEGORY_ID,
  LITE_DAILY_AND_BREAKFAST_CATEGORY_ID,
  LITE_SNACKS_AND_BEVERAGES_CATEGORY_ID,
  LITE_BAKERY_AND_BREADS_CATEGORY_ID,
  LITE_STAPLES_AND_COOKING_CATEGORY_ID,
  LITE_WAREHOUSES,
  type LiteWarehouseId,
} from '../dashboard.config';

export { LITE_WAREHOUSES, type LiteWarehouseId };

// ============================================================================
// 1. CATEGORY 201 (ALL) - 7 LEGACY LITE WIDGETS
// ============================================================================

export const LITE_CAT201_HERO_BANNER_ITEMS: any[] = [
  {
    "id": "lite-hero-1",
    "badge": "10 Min Delivery",
    "title": "Groceries Delivered in 10 Minutes",
    "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    "subtitle": "Fresh farm veggies, milk, fruits & daily staples at wholesale prices",
    "buttonText": "Order Now",
    "redirectUrl": "/lite/category/c4000000-0000-4000-8000-000000000201",
    "redirectType": "CATEGORY"
  }
];
export const LITE_CAT201_EVERYDAY_ESSENTIALS_ITEMS: any[] = [];
export const LITE_CAT201_DISPATCH_BELT_ITEMS: any[] = [
  {
    "id": "lite-dispatch-1",
    "badge": "HAATZA LITE",
    "title": "HAATZA Lite Express Delivery Hub",
    "imageUrl": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "subtitle": "Automated packing and rapid 10-minute neighbourhood dispatch",
    "buttonText": "Learn More",
    "redirectUrl": "/lite/delivery-info",
    "redirectType": "CAMPAIGN"
  }
];
export const LITE_CAT201_PROMO_BANNER_ITEMS: any[] = [
  {
    "id": "banner-promo-banner-1",
    "badge": "Offers",
    "title": "Promo Banner",
    "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    "subtitle": "Curated offers for Haatza LITE",
    "buttonText": "Explore",
    "redirectUrl": "/offers",
    "redirectType": "CAMPAIGN"
  }
];
export const LITE_CAT201_OFFER_BANNER_ITEMS: any[] = [
  {
    "id": "banner-offer-banner-1",
    "badge": "Offers",
    "title": "Offer Banner",
    "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    "subtitle": "Curated offers for Haatza LITE",
    "buttonText": "Explore",
    "redirectUrl": "/offers",
    "redirectType": "CAMPAIGN"
  }
];
export const LITE_CAT201_FRUITS_GREENS_ITEMS: any[] = [];
export const LITE_CAT201_HOUSEHOLD_HYGIENE_ITEMS: any[] = [];

// ============================================================================
// 2. CATEGORIES 202 TO 212 - 22 CATEGORY WIDGETS (HERO BANNER & PRODUCTS)
// ============================================================================

export const LITE_FRUITS_AND_VEGETABLES_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
    "title": "Farm Fresh Fruits & Vegetables",
    "content": "Handpicked fresh organic greens, crunchy apples & crisp veggies in 10 mins",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000202",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    "title": "Seasonal Organic Harvest Specials",
    "content": "Up to 30% off farm direct pesticide-free seasonal produce",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000202",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_FRUITS_AND_VEGETABLES_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0001",
    "product_title": "Fresh Organic Royal Gala Apples (4 pcs, approx. 500g)",
    "product_image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 160,
    "discount_price": 129,
    "discount_percentage": 19,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0002",
    "product_title": "Fresh Local Hybrid Tomato (1 kg Pack)",
    "product_image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 50,
    "discount_price": 38,
    "discount_percentage": 24,
    "is_add_to_cart": true
  }
];

export const LITE_DAILY_AND_BREAKFAST_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80",
    "title": "Morning Fresh Milk, Eggs & Bread",
    "content": "Daily breakfast essentials delivered straight to your doorstep by 7 AM",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000203",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80",
    "title": "Healthy Cereals, Oats & Spreads",
    "content": "Fuel your active day with wholesome oats, honey, muesli & butter",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000203",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_DAILY_AND_BREAKFAST_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0003",
    "product_title": "Amul Taaza Homogenised Toned Milk (1 Litre Tetra Pack)",
    "product_image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 72,
    "discount_price": 68,
    "discount_percentage": 6,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0004",
    "product_title": "Kellogg's Corn Flakes Original Crispy Breakfast Cereal (500g Box)",
    "product_image": "https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 225,
    "discount_price": 185,
    "discount_percentage": 18,
    "is_add_to_cart": true
  }
];

export const LITE_SNACKS_AND_BEVERAGES_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80",
    "title": "Chai Time Treats & Cold Drinks",
    "content": "Crunchy namkeen, artisan biscuits & ice-cold sodas in 10 minutes",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000204",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
    "title": "Gourmet Roasted Nuts & Healthy Bars",
    "content": "Guilt-free snacking with roasted almonds, trail mix and dark chocolates",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000204",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_SNACKS_AND_BEVERAGES_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0005",
    "product_title": "Haldiram's Nagpur Spicy Crispy Aloo Bhujia Namkeen (400g Pouch)",
    "product_image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000204",
    "mrp": 120,
    "discount_price": 99,
    "discount_percentage": 18,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0006",
    "product_title": "Tata Tea Gold Premium Assam & Long Leaves Rich Aroma (500g Pack)",
    "product_image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000204",
    "mrp": 350,
    "discount_price": 295,
    "discount_percentage": 16,
    "is_add_to_cart": true
  }
];

export const LITE_HOUSEHOLD_CLEANING_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
    "title": "Sparkling Clean Home & Kitchen",
    "content": "Top-rated dishwash gels, floor cleaners, detergents & garbage bags",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000205",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80",
    "title": "Disinfection & Hygiene Super Savers",
    "content": "Keep your home 99.9% germ-free with trusted hygiene essentials",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000205",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_HOUSEHOLD_CLEANING_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0007",
    "product_title": "Vim Lemon Dishwash Liquid Gel with Tough Grease Removal (750ml Bottle)",
    "product_image": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 199,
    "discount_price": 169,
    "discount_percentage": 15,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0008",
    "product_title": "Lizol Disinfectant Surface & Floor Cleaner Citrus Fragrance (1 Litre)",
    "product_image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 235,
    "discount_price": 199,
    "discount_percentage": 15,
    "is_add_to_cart": true
  }
];

export const LITE_PERSONAL_CARE_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    "title": "Daily Bath & Glow Essentials",
    "content": "Luxurious body soaps, refreshing washes & gentle deodorants",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000206",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    "title": "Hair Care & Oral Hygiene Must-Haves",
    "content": "Dermatologist-tested shampoos, conditioners and dental care",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000206",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_PERSONAL_CARE_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0009",
    "product_title": "Dettol Original Germ Protection Bathing Soap (125g x 4 Value Pack)",
    "product_image": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000206",
    "mrp": 240,
    "discount_price": 199,
    "discount_percentage": 17,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0010",
    "product_title": "Dove Intense Repair Deep Nourishing Shampoo with Keratin (650ml)",
    "product_image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000206",
    "mrp": 650,
    "discount_price": 499,
    "discount_percentage": 23,
    "is_add_to_cart": true
  }
];

export const LITE_KITCHEN_ESSENTIALS_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    "title": "Non-Stick Cookware & Smart Prep Tools",
    "content": "Durable frying pans, kadhais, pressure cookers & chef knives",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000207",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
    "title": "Airtight Glass & Stainless Steel Storage",
    "content": "Organise your pantry with leakproof containers and spice jars",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000207",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_KITCHEN_ESSENTIALS_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0011",
    "product_title": "Prestige Omega Deluxe Granite Induction Base Omni Tawa (280mm)",
    "product_image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000207",
    "mrp": 1250,
    "discount_price": 899,
    "discount_percentage": 28,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0012",
    "product_title": "Cello Checkers Airtight Food-Grade Plastic Storage Container Set (6 Pcs)",
    "product_image": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000207",
    "mrp": 450,
    "discount_price": 329,
    "discount_percentage": 27,
    "is_add_to_cart": true
  }
];

export const LITE_BAKERY_AND_BREADS_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    "title": "Artisan Sourdough & Freshly Baked Loaves",
    "content": "Oven-fresh whole wheat breads, burger buns, pav & garlic toasts",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000208",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    "title": "Sweet Bakes, Muffins & Butter Cookies",
    "content": "Indulgent tea-time cakes, croissants and bakery biscuits",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000208",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_BAKERY_AND_BREADS_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0013",
    "product_title": "Britannia 100% Whole Wheat Fresh Sliced Bread (400g Loaf)",
    "product_image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000208",
    "mrp": 55,
    "discount_price": 50,
    "discount_percentage": 9,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0014",
    "product_title": "The Baker's Dozen Soft Eggless Butter Croissant (Pack of 2)",
    "product_image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000208",
    "mrp": 149,
    "discount_price": 125,
    "discount_percentage": 16,
    "is_add_to_cart": true
  }
];

export const LITE_STAPLES_AND_COOKING_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    "title": "Premium Sharbati Atta, Basmati Rice & Dals",
    "content": "Direct from selected mandis, unpolished pulses and pure whole grains",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000209",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    "title": "Cold Pressed Mustard, Sunflower Oils & Cow Ghee",
    "content": "Purity guaranteed with filtered cooking oils, spices and pink salt",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000209",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_STAPLES_AND_COOKING_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0015",
    "product_title": "Aashirvaad Superior MP Sharbati Whole Wheat Atta (5kg Bag)",
    "product_image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000209",
    "mrp": 310,
    "discount_price": 275,
    "discount_percentage": 11,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0016",
    "product_title": "Fortune Sunlite Refined Sunflower Cooking Oil (1 Litre Pouch)",
    "product_image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000209",
    "mrp": 165,
    "discount_price": 139,
    "discount_percentage": 16,
    "is_add_to_cart": true
  }
];

export const LITE_FROZEN_FOODS_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80",
    "title": "Crispy Evening Finger Foods Ready in 5 Mins",
    "content": "French fries, cheese nuggets, aloo tikki & veg burgers in instant freeze pack",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000210",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "title": "Farm Frozen Green Peas & Sweet Corn",
    "content": "Preserved nutrients with rapid cryogenic freezing technology",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000210",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_FROZEN_FOODS_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0017",
    "product_title": "McCain Crispy Masala French Fries Frozen Snack (420g Pack)",
    "product_image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000210",
    "mrp": 145,
    "discount_price": 119,
    "discount_percentage": 18,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0018",
    "product_title": "Safal Frozen Tender Sweet Green Peas (1kg Family Pack)",
    "product_image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000210",
    "mrp": 180,
    "discount_price": 145,
    "discount_percentage": 19,
    "is_add_to_cart": true
  }
];

export const LITE_BABY_CARE_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    "title": "Ultra-Soft Anti-Rash Diapers & Wet Wipes",
    "content": "Keep your little one smiling all day with dermatologist-approved gentle diapers",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000211",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
    "title": "Pure Tear-Free Baby Bath & Nourishing Oils",
    "content": "Hypoallergenic baby lotions, massage oils and organic baby cereal",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000211",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_BABY_CARE_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0019",
    "product_title": "Pampers All Round Protection Baby Diaper Pants (Size M, 54 Count)",
    "product_image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000211",
    "mrp": 1199,
    "discount_price": 899,
    "discount_percentage": 25,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0020",
    "product_title": "Johnson's Baby Tear-Free Gentle Top-to-Toe Bath Wash (500ml)",
    "product_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000211",
    "mrp": 425,
    "discount_price": 349,
    "discount_percentage": 18,
    "is_add_to_cart": true
  }
];

export const LITE_PET_SUPPLIES_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    "title": "Healthy Dog Nutrition, Wet Gravy & Biscuits",
    "content": "Tail-wagging goodness with real meat dog kibbles & chew treats",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000212",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
    "title": "Cat Food, Scratchers & Odour-Free Litter",
    "content": "Purr-fect seafood recipes and premium clumping bentonite cat litter",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000212",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_PET_SUPPLIES_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0021",
    "product_title": "Pedigree Adult Complete Nutrition Dry Dog Food Meat & Rice (3kg Bag)",
    "product_image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000212",
    "mrp": 1150,
    "discount_price": 975,
    "discount_percentage": 15,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0022",
    "product_title": "Whiskas Adult Cat Food Ocean Fish Flavour with Real Fish (1.2kg Pack)",
    "product_image": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000212",
    "mrp": 450,
    "discount_price": 385,
    "discount_percentage": 14,
    "is_add_to_cart": true
  }
];

// ============================================================================
// 3. MASTER 29-WIDGET BLOCK TEMPLATE (USED ACROSS ALL 5 WAREHOUSES & 2 PLACEMENTS)
// ============================================================================

export interface LiteWidgetTemplate {
  offset: number;
  sequence: number;
  widgetName: string;
  categoryId: string;
  items: any[];
}

export const LITE_29_WIDGET_TEMPLATE: LiteWidgetTemplate[] = [
  { offset: 0, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_HERO_BANNER_ITEMS },
  { offset: 1, sequence: 2, widgetName: 'Everyday Essentials', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_EVERYDAY_ESSENTIALS_ITEMS },
  { offset: 2, sequence: 3, widgetName: 'Live Automated Dispatch Belt', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_DISPATCH_BELT_ITEMS },
  { offset: 3, sequence: 4, widgetName: 'Promo Banner', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_PROMO_BANNER_ITEMS },
  { offset: 4, sequence: 5, widgetName: 'Offer Banner', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_OFFER_BANNER_ITEMS },
  { offset: 5, sequence: 6, widgetName: 'Fresh Fruits and Daily Greens', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_FRUITS_GREENS_ITEMS },
  { offset: 6, sequence: 7, widgetName: 'Household Cleaning and Hygiene', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_HOUSEHOLD_HYGIENE_ITEMS },
  { offset: 7, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_FRUITS_AND_VEGETABLES_CATEGORY_ID, items: LITE_FRUITS_AND_VEGETABLES_BANNER_ITEMS },
  { offset: 8, sequence: 2, widgetName: 'Category Products', categoryId: LITE_FRUITS_AND_VEGETABLES_CATEGORY_ID, items: LITE_FRUITS_AND_VEGETABLES_PRODUCT_ITEMS },
  { offset: 9, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_DAILY_AND_BREAKFAST_CATEGORY_ID, items: LITE_DAILY_AND_BREAKFAST_BANNER_ITEMS },
  { offset: 10, sequence: 2, widgetName: 'Category Products', categoryId: LITE_DAILY_AND_BREAKFAST_CATEGORY_ID, items: LITE_DAILY_AND_BREAKFAST_PRODUCT_ITEMS },
  { offset: 11, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_SNACKS_AND_BEVERAGES_CATEGORY_ID, items: LITE_SNACKS_AND_BEVERAGES_BANNER_ITEMS },
  { offset: 12, sequence: 2, widgetName: 'Category Products', categoryId: LITE_SNACKS_AND_BEVERAGES_CATEGORY_ID, items: LITE_SNACKS_AND_BEVERAGES_PRODUCT_ITEMS },
  { offset: 13, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_HOUSEHOLD_CLEANING_CATEGORY_ID, items: LITE_HOUSEHOLD_CLEANING_BANNER_ITEMS },
  { offset: 14, sequence: 2, widgetName: 'Category Products', categoryId: LITE_HOUSEHOLD_CLEANING_CATEGORY_ID, items: LITE_HOUSEHOLD_CLEANING_PRODUCT_ITEMS },
  { offset: 15, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_PERSONAL_CARE_CATEGORY_ID, items: LITE_PERSONAL_CARE_BANNER_ITEMS },
  { offset: 16, sequence: 2, widgetName: 'Category Products', categoryId: LITE_PERSONAL_CARE_CATEGORY_ID, items: LITE_PERSONAL_CARE_PRODUCT_ITEMS },
  { offset: 17, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_KITCHEN_ESSENTIALS_CATEGORY_ID, items: LITE_KITCHEN_ESSENTIALS_BANNER_ITEMS },
  { offset: 18, sequence: 2, widgetName: 'Category Products', categoryId: LITE_KITCHEN_ESSENTIALS_CATEGORY_ID, items: LITE_KITCHEN_ESSENTIALS_PRODUCT_ITEMS },
  { offset: 19, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_BAKERY_AND_BREADS_CATEGORY_ID, items: LITE_BAKERY_AND_BREADS_BANNER_ITEMS },
  { offset: 20, sequence: 2, widgetName: 'Category Products', categoryId: LITE_BAKERY_AND_BREADS_CATEGORY_ID, items: LITE_BAKERY_AND_BREADS_PRODUCT_ITEMS },
  { offset: 21, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_STAPLES_AND_COOKING_CATEGORY_ID, items: LITE_STAPLES_AND_COOKING_BANNER_ITEMS },
  { offset: 22, sequence: 2, widgetName: 'Category Products', categoryId: LITE_STAPLES_AND_COOKING_CATEGORY_ID, items: LITE_STAPLES_AND_COOKING_PRODUCT_ITEMS },
  { offset: 23, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_FROZEN_FOODS_CATEGORY_ID, items: LITE_FROZEN_FOODS_BANNER_ITEMS },
  { offset: 24, sequence: 2, widgetName: 'Category Products', categoryId: LITE_FROZEN_FOODS_CATEGORY_ID, items: LITE_FROZEN_FOODS_PRODUCT_ITEMS },
  { offset: 25, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_BABY_CARE_CATEGORY_ID, items: LITE_BABY_CARE_BANNER_ITEMS },
  { offset: 26, sequence: 2, widgetName: 'Category Products', categoryId: LITE_BABY_CARE_CATEGORY_ID, items: LITE_BABY_CARE_PRODUCT_ITEMS },
  { offset: 27, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_PET_SUPPLIES_CATEGORY_ID, items: LITE_PET_SUPPLIES_BANNER_ITEMS },
  { offset: 28, sequence: 2, widgetName: 'Category Products', categoryId: LITE_PET_SUPPLIES_CATEGORY_ID, items: LITE_PET_SUPPLIES_PRODUCT_ITEMS },
];

/**
 * Builds the complete dictionary of 290 LITE rows (w0170 to w0459).
 */
export function buildAllLiteRows(): Record<string, { widgetName: string; sequence: number; categoryId: string; warehouseId: string; placement: 'DESKTOP' | 'MOBILE'; items: any[] }> {
  const result: Record<string, any> = {};
  let currentWidgetNum = 170;

  for (const warehouse of LITE_WAREHOUSES) {
    for (const placement of ['DESKTOP', 'MOBILE'] as const) {
      for (const t of LITE_29_WIDGET_TEMPLATE) {
        const widgetId = 'w' + String(currentWidgetNum).padStart(4, '0');
        result[widgetId] = {
          widgetName: t.widgetName,
          sequence: t.sequence,
          categoryId: t.categoryId,
          warehouseId: warehouse,
          placement,
          items: t.items,
        };
        currentWidgetNum++;
      }
    }
  }

  return result;
}

export const ALL_LITE_WIDGET_ITEMS: Record<string, any[]> = (() => {
  const all = buildAllLiteRows();
  const dict: Record<string, any[]> = {};
  for (const [wid, row] of Object.entries(all)) {
    dict[wid] = row.items;
  }
  return dict;
})();
