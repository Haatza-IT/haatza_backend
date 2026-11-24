# HAATZA & LITE Customer Dashboard API Documentation

**Base URL:**  
`https://haatza-backend.onrender.com`

This document provides technical documentation for the two customer-facing Dashboard `GET` APIs used by the Haatza mobile and web applications to render dynamic homepages.

---

## 1. HAATZA Customer Dashboard API

**Method:** `GET`

**Endpoint:**
```http
GET /api/dashboard?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=56&placement=DESKTOP
```

**Purpose:** Fetches the customer dashboard layout for HAATZA Shopping, including promotional hero banners, category grids, flash deals, and curated product shelves.

### Query Parameters

| Parameter | Required | Data Type | Default | Description & Validation Behavior |
|---|:---:|---|:---:|---|
| `module` | **Yes** | `string` | — | Dashboard module identifier. Must be strictly `HAATZA` (case-insensitive). Missing, invalid, or legacy values (e.g. `SHOPPING`) reject with HTTP 400 Bad Request. |
| `categoryId` | **Yes** | `string` | — | Category UUID (e.g. `c4000000-0000-4000-8000-000000000101` for All, `c4000000-0000-4000-8000-000000000102` for Electronics). Filters layout widgets and items to the requested category. Missing or empty category ID rejects with HTTP 400 Bad Request. |
| `territory` | **Yes** | `string` | — | Exact 2-digit state PIN-code prefix (e.g. `56` for Karnataka). Missing or invalid non-2-digit values reject with HTTP 400 Bad Request. |
| `placement` | **Yes** | `string` | — | Layout placement filter. Must be strictly `DESKTOP` or `MOBILE` (case-sensitive uppercase). Missing or invalid values reject with HTTP 400 Bad Request. |

**Configured Widgets:** Configured widgets `W001` through `W016` (sequence 1–16). All 16 layout containers are preserved; product shelves without matching category products return `items: []` rather than disappearing from the sequence.

> **Note:** Some items arrays in the documentation examples below are shortened for readability. The actual API response contains all applicable items, and `total_items` represents the actual number of items returned in the array.

### Complete HAATZA Success Response Example (`200 OK`)

```json
{
  "success": true,
  "module": "HAATZA",
  "placement": "HOME",
  "territory": "56",
  "warehouseId": "",
  "total_widgets": 16,
  "data": [
    {
      "widget_id": "W001",
      "widget_name": "Hero Banner",
      "widget_redirect_to": "/offers/festive-sale",
      "placement": "HOME",
      "sequence": 1,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "haatza-hero-1",
          "title": "Big Festive Electronics & Fashion Sale",
          "subtitle": "Up to 70% Off on Top National Brands with Instant Bank Discounts",
          "badge": "Mega Sale",
          "imageUrl": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Explore Deals",
          "button_text": "Explore Deals",
          "redirectType": "CAMPAIGN",
          "redirect_type": "CAMPAIGN",
          "redirectUrl": "/offers/festive-sale",
          "redirect_url": "/offers/festive-sale"
        },
        {
          "id": "haatza-hero-2",
          "title": "Trending Winter & Summer Wardrobes",
          "subtitle": "Premium cotton t-shirts, kurtis, jackets & watches from ₹299",
          "badge": "Trending Now",
          "imageUrl": "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Shop Fashion",
          "button_text": "Shop Fashion",
          "redirectType": "CATEGORY",
          "redirect_type": "CATEGORY",
          "redirectUrl": "/categories/c1000000-0000-4000-8000-000000000001",
          "redirect_url": "/categories/c1000000-0000-4000-8000-000000000001"
        }
      ],
      "total_items": 2
    },
    {
      "widget_id": "W002",
      "widget_name": "Offers Banner",
      "widget_redirect_to": "/offers",
      "placement": "HOME",
      "sequence": 2,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "haatza-offer-1",
          "title": "Super Saver Weekend Deals",
          "subtitle": "Extra 10% off on all credit cards with free home delivery",
          "badge": "Weekend Special",
          "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "View Offers",
          "button_text": "View Offers",
          "redirectType": "CAMPAIGN",
          "redirect_type": "CAMPAIGN",
          "redirectUrl": "/offers",
          "redirect_url": "/offers"
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W003",
      "widget_name": "Top Categories",
      "widget_redirect_to": "/categories",
      "placement": "HOME",
      "sequence": 3,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "CATEGORY",
      "items": [
        {
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "slug": "fashion",
          "categoryImage": "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
          "category_image": "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
          "redirectType": "CATEGORY",
          "redirect_type": "CATEGORY",
          "redirectUrl": "/categories/c1000000-0000-4000-8000-000000000001",
          "redirect_url": "/categories/c1000000-0000-4000-8000-000000000001"
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W004",
      "widget_name": "Suggested for You",
      "widget_redirect_to": "/recommendations",
      "placement": "HOME",
      "sequence": 4,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000008",
          "product_id": "d1000000-0000-4000-8000-000000000008",
          "productName": "Fastrack Polarized Aviator Sunglasses",
          "product_name": "Fastrack Polarized Aviator Sunglasses",
          "description": "UV-protected premium metal frame stylish aviator sunglasses",
          "productImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Fastrack",
          "price": 1199,
          "mrp": 1499,
          "discount": 20,
          "onSalePrice": 1199,
          "onsale_price": 1199,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000008",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000008",
          "id": "d1000000-0000-4000-8000-000000000008",
          "name": "Fastrack Polarized Aviator Sunglasses",
          "mainImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 1199,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 20
        },
        {
          "productId": "d1000000-0000-4000-8000-000000000007",
          "product_id": "d1000000-0000-4000-8000-000000000007",
          "productName": "Fossil Leather Chronograph Watch",
          "product_name": "Fossil Leather Chronograph Watch",
          "description": "Elegant stainless steel chronograph watch with genuine leather strap",
          "productImage": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Fossil",
          "price": 6497,
          "mrp": 9995,
          "discount": 35,
          "onSalePrice": 6497,
          "onsale_price": 6497,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "New Arrival",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000007",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000007",
          "id": "d1000000-0000-4000-8000-000000000007",
          "name": "Fossil Leather Chronograph Watch",
          "mainImage": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 6497,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 35
        }
      ],
      "total_items": 2
    },
    {
      "widget_id": "W005",
      "widget_name": "Promo Banners",
      "widget_redirect_to": "/promotions",
      "placement": "HOME",
      "sequence": 5,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "haatza-promo-1",
          "title": "Exclusive Brand Partnerships",
          "subtitle": "Shop directly from top verified brand houses",
          "badge": "Verified",
          "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Explore",
          "button_text": "Explore",
          "redirectType": "CAMPAIGN",
          "redirect_type": "CAMPAIGN",
          "redirectUrl": "/campaigns/verified-brands",
          "redirect_url": "/campaigns/verified-brands"
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W006",
      "widget_name": "Liked By You",
      "widget_redirect_to": "/wishlist",
      "placement": "HOME",
      "sequence": 6,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000001",
          "product_id": "d1000000-0000-4000-8000-000000000001",
          "productName": "Allen Solly Men's Casual T-Shirt",
          "product_name": "Allen Solly Men's Casual T-Shirt",
          "description": "Premium pure cotton breathable round neck t-shirt",
          "productImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Allen Solly",
          "price": 1039,
          "mrp": 1299,
          "discount": 20,
          "onSalePrice": 1039,
          "onsale_price": 1039,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Trending",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000001",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000001",
          "id": "d1000000-0000-4000-8000-000000000001",
          "name": "Allen Solly Men's Casual T-Shirt",
          "mainImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 1039,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 20
        },
        {
          "productId": "d1000000-0000-4000-8000-000000000002",
          "product_id": "d1000000-0000-4000-8000-000000000002",
          "productName": "Levi's 511 Slim Fit Denim Jeans",
          "product_name": "Levi's 511 Slim Fit Denim Jeans",
          "description": "Classic durable stretchable cotton denim everyday jeans",
          "productImage": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Levi's",
          "price": 2099,
          "mrp": 2999,
          "discount": 30,
          "onSalePrice": 2099,
          "onsale_price": 2099,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Popular",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000002",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000002",
          "id": "d1000000-0000-4000-8000-000000000002",
          "name": "Levi's 511 Slim Fit Denim Jeans",
          "mainImage": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 2099,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 30
        }
      ],
      "total_items": 2
    },
    {
      "widget_id": "W007",
      "widget_name": "Recently Viewed By You",
      "widget_redirect_to": "/history",
      "placement": "HOME",
      "sequence": 7,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000003",
          "product_id": "d1000000-0000-4000-8000-000000000003",
          "productName": "Biba Women's Floral Maxi Dress",
          "product_name": "Biba Women's Floral Maxi Dress",
          "description": "Comfortable summer floral printed pure cotton maxi dress",
          "productImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Biba",
          "price": 1499,
          "mrp": 1999,
          "discount": 25,
          "onSalePrice": 1499,
          "onsale_price": 1499,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Deals of Day",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000003",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000003",
          "id": "d1000000-0000-4000-8000-000000000003",
          "name": "Biba Women's Floral Maxi Dress",
          "mainImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 1499,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 25
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W008",
      "widget_name": "Banner for 49rs, trending fashion, best seller favourites and big deals",
      "widget_redirect_to": "/promotions/combo",
      "placement": "HOME",
      "sequence": 8,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "10000000-0000-4000-8000-000000000081",
          "title": "Trending Fashion",
          "subtitle": "Fresh season drops & curated wardrobe staples at prices you will love",
          "badge": "NEW SEASON DROP",
          "imageUrl": "/images/banners/home-page-girl.png",
          "image_url": "/images/banners/home-page-girl.png",
          "buttonText": "Shop Trending Fashion",
          "button_text": "Shop Trending Fashion",
          "redirectType": "CATEGORY",
          "redirect_type": "CATEGORY",
          "redirectUrl": "/category/all",
          "redirect_url": "/category/all"
        },
        {
          "id": "10000000-0000-4000-8000-000000000082",
          "title": "Bestseller Favourites",
          "subtitle": "Top-rated customer picks loved by thousands with verified 4.5+ star quality",
          "badge": "POPULAR PICKS",
          "imageUrl": "/images/banners/home-page-girl.png",
          "image_url": "/images/banners/home-page-girl.png",
          "buttonText": "Shop Bestsellers",
          "button_text": "Shop Bestsellers",
          "redirectType": "CATEGORY",
          "redirect_type": "CATEGORY",
          "redirectUrl": "/category/all",
          "redirect_url": "/category/all"
        },
        {
          "id": "10000000-0000-4000-8000-000000000083",
          "title": "Deals of the Day",
          "subtitle": "Unbeatable daily flash savings and limited-time discounts on top brands",
          "badge": "LIMITED TIME",
          "imageUrl": "/images/banners/home-page-girl.png",
          "image_url": "/images/banners/home-page-girl.png",
          "buttonText": "Discover Big Deals",
          "button_text": "Discover Big Deals",
          "redirectType": "CATEGORY",
          "redirect_type": "CATEGORY",
          "redirectUrl": "/category/deals",
          "redirect_url": "/category/deals"
        },
        {
          "id": "10000000-0000-4000-8000-000000000084",
          "title": "₹49 Store",
          "subtitle": "Everyday essentials, snacks, and budget finds for just flat ₹49",
          "badge": "BUDGET FINDS",
          "imageUrl": "/images/banners/home-page-girl.png",
          "image_url": "/images/banners/home-page-girl.png",
          "buttonText": "Explore ₹49 Store",
          "button_text": "Explore ₹49 Store",
          "redirectType": "CAMPAIGN",
          "redirect_type": "CAMPAIGN",
          "redirectUrl": "/store/49",
          "redirect_url": "/store/49"
        }
      ],
      "total_items": 4
    },
    {
      "widget_id": "W009",
      "widget_name": "Trending Fashion",
      "widget_redirect_to": "/categories/fashion",
      "placement": "HOME",
      "sequence": 9,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "c1000000-0000-4000-8000-000000000001",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000001",
          "product_id": "d1000000-0000-4000-8000-000000000001",
          "productName": "Allen Solly Men's Casual T-Shirt",
          "product_name": "Allen Solly Men's Casual T-Shirt",
          "description": "Premium pure cotton breathable round neck t-shirt",
          "productImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Allen Solly",
          "price": 1039,
          "mrp": 1299,
          "discount": 20,
          "onSalePrice": 1039,
          "onsale_price": 1039,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Trending",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000001",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000001",
          "id": "d1000000-0000-4000-8000-000000000001",
          "name": "Allen Solly Men's Casual T-Shirt",
          "mainImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 1039,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 20
        },
        {
          "productId": "d1000000-0000-4000-8000-000000000002",
          "product_id": "d1000000-0000-4000-8000-000000000002",
          "productName": "Levi's 511 Slim Fit Denim Jeans",
          "product_name": "Levi's 511 Slim Fit Denim Jeans",
          "description": "Classic durable stretchable cotton denim everyday jeans",
          "productImage": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Levi's",
          "price": 2099,
          "mrp": 2999,
          "discount": 30,
          "onSalePrice": 2099,
          "onsale_price": 2099,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Popular",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000002",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000002",
          "id": "d1000000-0000-4000-8000-000000000002",
          "name": "Levi's 511 Slim Fit Denim Jeans",
          "mainImage": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 2099,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 30
        },
        {
          "productId": "d1000000-0000-4000-8000-000000000003",
          "product_id": "d1000000-0000-4000-8000-000000000003",
          "productName": "Biba Women's Floral Maxi Dress",
          "product_name": "Biba Women's Floral Maxi Dress",
          "description": "Comfortable summer floral printed pure cotton maxi dress",
          "productImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Biba",
          "price": 1499,
          "mrp": 1999,
          "discount": 25,
          "onSalePrice": 1499,
          "onsale_price": 1499,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Deals of Day",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000003",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000003",
          "id": "d1000000-0000-4000-8000-000000000003",
          "name": "Biba Women's Floral Maxi Dress",
          "mainImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 1499,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 25
        }
      ],
      "total_items": 3
    },
    {
      "widget_id": "W010",
      "widget_name": "Deals of the Day",
      "widget_redirect_to": "/deals",
      "placement": "HOME",
      "sequence": 10,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000004",
          "product_id": "d1000000-0000-4000-8000-000000000004",
          "productName": "FabIndia Men's Formal Cotton Shirt",
          "product_name": "FabIndia Men's Formal Cotton Shirt",
          "description": "Pure breathable cotton formal office and festive shirt",
          "productImage": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "FabIndia",
          "price": 1529,
          "mrp": 1799,
          "discount": 15,
          "onSalePrice": 1529,
          "onsale_price": 1529,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000004",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000004",
          "id": "d1000000-0000-4000-8000-000000000004",
          "name": "FabIndia Men's Formal Cotton Shirt",
          "mainImage": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 1529,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 15
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W011",
      "widget_name": "49rs banner",
      "widget_redirect_to": "/store/49",
      "placement": "HOME",
      "sequence": 11,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "haatza-49-banner-1",
          "title": "Budget Corner - Everything Under ₹49",
          "subtitle": "Unbeatable prices on daily accessories & travel packs",
          "badge": "Flat ₹49",
          "imageUrl": "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Shop ₹49",
          "button_text": "Shop ₹49",
          "redirectType": "CAMPAIGN",
          "redirect_type": "CAMPAIGN",
          "redirectUrl": "/store/49",
          "redirect_url": "/store/49"
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W012",
      "widget_name": "₹49 Store",
      "widget_redirect_to": "/store/49",
      "placement": "HOME",
      "sequence": 12,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000011",
          "product_id": "d1000000-0000-4000-8000-000000000011",
          "productName": "Polarized Aviator Sunglasses (Matte Silver Frame)",
          "product_name": "Polarized Aviator Sunglasses (Matte Silver Frame)",
          "description": "100% UV400 protection polarized lenses with lightweight steel alloy temple",
          "productImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
          "product_image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion Accessories",
          "category_name": "Fashion Accessories",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "HAATZA EYEWEAR",
          "price": 49,
          "mrp": 490,
          "discount": 90,
          "onSalePrice": 49,
          "onsale_price": 49,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Flat ₹49",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000011",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000011",
          "id": "d1000000-0000-4000-8000-000000000011",
          "name": "Polarized Aviator Sunglasses (Matte Silver Frame)",
          "mainImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 49,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
          ],
          "rating": 4.9,
          "reviewCount": 540,
          "inStock": true,
          "stock": 120,
          "discountPercentage": 90
        },
        {
          "productId": "d1000000-0000-4000-8000-000000000012",
          "product_id": "d1000000-0000-4000-8000-000000000012",
          "productName": "Retro Sport Royal Sneakers (Cushioned Low-Top)",
          "product_name": "Retro Sport Royal Sneakers (Cushioned Low-Top)",
          "description": "Lightweight breathable sports sneakers with durable rubber traction sole",
          "productImage": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          "product_image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Footwear",
          "category_name": "Footwear",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "KICKSUP",
          "price": 49,
          "mrp": 350,
          "discount": 86,
          "onSalePrice": 49,
          "onsale_price": 49,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Flat ₹49",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000012",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000012",
          "id": "d1000000-0000-4000-8000-000000000012",
          "name": "Retro Sport Royal Sneakers (Cushioned Low-Top)",
          "mainImage": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 49,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
          ],
          "rating": 4.8,
          "reviewCount": 680,
          "inStock": true,
          "stock": 95,
          "discountPercentage": 86
        },
        {
          "productId": "d1000000-0000-4000-8000-000000000013",
          "product_id": "d1000000-0000-4000-8000-000000000013",
          "productName": "Pure Linen Blend Summer Shirt (Sky Blue)",
          "product_name": "Pure Linen Blend Summer Shirt (Sky Blue)",
          "description": "Breathable lightweight linen cotton blend everyday casual summer shirt",
          "productImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
          "product_image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Men Fashion",
          "category_name": "Men Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "HAATZA SELECT",
          "price": 49,
          "mrp": 245,
          "discount": 80,
          "onSalePrice": 49,
          "onsale_price": 49,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Flat ₹49",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000013",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000013",
          "id": "d1000000-0000-4000-8000-000000000013",
          "name": "Pure Linen Blend Summer Shirt (Sky Blue)",
          "mainImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 49,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
          ],
          "rating": 4.7,
          "reviewCount": 410,
          "inStock": true,
          "stock": 80,
          "discountPercentage": 80
        }
      ],
      "total_items": 3
    },
    {
      "widget_id": "W013",
      "widget_name": "Hurry! Deals Ending Soon",
      "widget_redirect_to": "/deals/ending-soon",
      "placement": "HOME",
      "sequence": 13,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000008",
          "product_id": "d1000000-0000-4000-8000-000000000008",
          "productName": "Fastrack Polarized Aviator Sunglasses",
          "product_name": "Fastrack Polarized Aviator Sunglasses",
          "description": "UV-protected premium metal frame stylish aviator sunglasses",
          "productImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Fastrack",
          "price": 1199,
          "mrp": 1499,
          "discount": 20,
          "onSalePrice": 1199,
          "onsale_price": 1199,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000008",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000008",
          "id": "d1000000-0000-4000-8000-000000000008",
          "name": "Fastrack Polarized Aviator Sunglasses",
          "mainImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 1199,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 20
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W014",
      "widget_name": "Best Seller Favourites",
      "widget_redirect_to": "/bestsellers",
      "placement": "HOME",
      "sequence": 14,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000005",
          "product_id": "d1000000-0000-4000-8000-000000000005",
          "productName": "Woodland Kids Cotton Pyjama Set",
          "product_name": "Woodland Kids Cotton Pyjama Set",
          "description": "Comfortable stretchable nightwear pyjama set for kids",
          "productImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Woodland",
          "price": 719,
          "mrp": 899,
          "discount": 20,
          "onSalePrice": 719,
          "onsale_price": 719,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Bestseller",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000005",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000005",
          "id": "d1000000-0000-4000-8000-000000000005",
          "name": "Woodland Kids Cotton Pyjama Set",
          "mainImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 719,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 20
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W015",
      "widget_name": "Fresh New Arrivals",
      "widget_redirect_to": "/new-arrivals",
      "placement": "HOME",
      "sequence": 15,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000007",
          "product_id": "d1000000-0000-4000-8000-000000000007",
          "productName": "Fossil Leather Chronograph Watch",
          "product_name": "Fossil Leather Chronograph Watch",
          "description": "Elegant stainless steel chronograph watch with genuine leather strap",
          "productImage": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c1000000-0000-4000-8000-000000000001",
          "category_id": "c1000000-0000-4000-8000-000000000001",
          "categoryName": "Fashion",
          "category_name": "Fashion",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Fossil",
          "price": 6497,
          "mrp": 9995,
          "discount": 35,
          "onSalePrice": 6497,
          "onsale_price": 6497,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "New Arrival",
          "isHaatzaLite": false,
          "is_haatzalite": false,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/products/d1000000-0000-4000-8000-000000000007",
          "redirect_url": "/products/d1000000-0000-4000-8000-000000000007",
          "id": "d1000000-0000-4000-8000-000000000007",
          "name": "Fossil Leather Chronograph Watch",
          "mainImage": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 6497,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 35
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W016",
      "widget_name": "More to Explore",
      "widget_redirect_to": "/explore",
      "placement": "HOME",
      "sequence": 16,
      "territory": "ALL",
      "module": "HAATZA",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [],
      "total_items": 0
    }
  ]
}
```

---

## 2. LITE Customer Dashboard API

**Method:** `GET`

**Endpoint:**
```http
GET /api/dashboard?module=LITE&categoryId=c4000000-0000-4000-8000-000000000101&warehouseId=WAREHOUSE001&territory=56&placement=DESKTOP
```

**Purpose:** Fetches the customer dashboard layout for Haatza LITE quick commerce, featuring express delivery banners, daily essentials, and fresh produce.

### Query Parameters

| Parameter | Required | Data Type | Default | Description & Validation Behavior |
|---|:---:|---|:---:|---|
| `module` | **Yes** | `string` | — | Dashboard module identifier. Must be strictly `LITE` (case-insensitive). Missing, invalid, or legacy values reject with HTTP 400 Bad Request. |
| `categoryId` | **Yes** | `string` | — | Category UUID. Filters widgets configured with a category match. Missing or empty category ID rejects with HTTP 400 Bad Request. |
| `warehouseId` | **Yes** | `string` | — | Dark store warehouse identifier (e.g. `WAREHOUSE001`). Required for LITE module. Missing warehouse ID rejects with HTTP 400 Bad Request. |
| `territory` | **Yes** | `string` | — | Exact 2-digit state PIN-code prefix (e.g. `56` for Karnataka). Missing or invalid non-2-digit values reject with HTTP 400 Bad Request. |
| `placement` | **Yes** | `string` | — | Layout placement filter. Must be strictly `DESKTOP` or `MOBILE` (case-sensitive uppercase). Missing or invalid values reject with HTTP 400 Bad Request. |

**Configured Widgets:** Configured widgets `W017` through `W023` (sequence 1–7). When filtered by category `c4000000-0000-4000-8000-000000000004`, 6 matching widgets (`W017`–`W022`) are returned. When `categoryId` is omitted, all 7 widgets (`W017`–`W023`) are returned.

> **Note:** Some items arrays in the documentation examples below are shortened for readability. The actual API response contains all applicable items, and `total_items` represents the actual number of items returned in the array.

### Complete LITE Success Response Example (`200 OK`)

```json
{
  "success": true,
  "module": "LITE",
  "placement": "HOME",
  "territory": "56",
  "warehouseId": "WAREHOUSE001",
  "total_widgets": 6,
  "data": [
    {
      "widget_id": "W017",
      "widget_name": "Hero Banner",
      "widget_redirect_to": "/lite/offers",
      "placement": "HOME",
      "sequence": 1,
      "territory": "ALL",
      "module": "LITE",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "lite-hero-1",
          "title": "Groceries Delivered in 10 Minutes",
          "subtitle": "Fresh farm veggies, milk, fruits & daily staples at wholesale prices",
          "badge": "10 Min Delivery",
          "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Order Now",
          "button_text": "Order Now",
          "redirectType": "CATEGORY",
          "redirect_type": "CATEGORY",
          "redirectUrl": "/lite/category/c4000000-0000-4000-8000-000000000004",
          "redirect_url": "/lite/category/c4000000-0000-4000-8000-000000000004"
        },
        {
          "id": "lite-hero-2",
          "title": "Fresh Farm Produce Morning Special",
          "subtitle": "Directly sourced from trusted local farmers every morning",
          "badge": "Farm Fresh",
          "imageUrl": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Shop Greens",
          "button_text": "Shop Greens",
          "redirectType": "CATEGORY",
          "redirect_type": "CATEGORY",
          "redirectUrl": "/lite/category/c4000000-0000-4000-8000-000000000004",
          "redirect_url": "/lite/category/c4000000-0000-4000-8000-000000000004"
        }
      ],
      "total_items": 2
    },
    {
      "widget_id": "W018",
      "widget_name": "Everyday Essentials",
      "widget_redirect_to": "/lite/category/grocery",
      "placement": "HOME",
      "sequence": 2,
      "territory": "ALL",
      "module": "LITE",
      "warehouse_id": "",
      "category_id": "c4000000-0000-4000-8000-000000000004",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000016",
          "product_id": "d1000000-0000-4000-8000-000000000016",
          "productName": "Aashirvaad Chakki Fresh Atta 10kg",
          "product_name": "Aashirvaad Chakki Fresh Atta 10kg",
          "description": "100% whole wheat grain traditional chakki ground atta",
          "productImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c4000000-0000-4000-8000-000000000004",
          "category_id": "c4000000-0000-4000-8000-000000000004",
          "categoryName": "Grocery & Daily Essentials",
          "category_name": "Grocery & Daily Essentials",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Aashirvaad",
          "price": 458,
          "mrp": 520,
          "discount": 12,
          "onSalePrice": 458,
          "onsale_price": 458,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Pantry Essential",
          "isHaatzaLite": true,
          "is_haatzalite": true,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/lite/products/d1000000-0000-4000-8000-000000000016",
          "redirect_url": "/lite/products/d1000000-0000-4000-8000-000000000016",
          "id": "d1000000-0000-4000-8000-000000000016",
          "name": "Aashirvaad Chakki Fresh Atta 10kg",
          "mainImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 458,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 12
        },
        {
          "productId": "d1000000-0000-4000-8000-000000000017",
          "product_id": "d1000000-0000-4000-8000-000000000017",
          "productName": "Fortune Sunlite Refined Sunflower Oil 1L",
          "product_name": "Fortune Sunlite Refined Sunflower Oil 1L",
          "description": "Light and healthy enriched cooking sunflower oil",
          "productImage": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c4000000-0000-4000-8000-000000000004",
          "category_id": "c4000000-0000-4000-8000-000000000004",
          "categoryName": "Grocery & Daily Essentials",
          "category_name": "Grocery & Daily Essentials",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Fortune",
          "price": 140,
          "mrp": 165,
          "discount": 15,
          "onSalePrice": 140,
          "onsale_price": 140,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "",
          "isHaatzaLite": true,
          "is_haatzalite": true,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/lite/products/d1000000-0000-4000-8000-000000000017",
          "redirect_url": "/lite/products/d1000000-0000-4000-8000-000000000017",
          "id": "d1000000-0000-4000-8000-000000000017",
          "name": "Fortune Sunlite Refined Sunflower Oil 1L",
          "mainImage": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 140,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 15
        }
      ],
      "total_items": 2
    },
    {
      "widget_id": "W019",
      "widget_name": "Live Automated Dispatch Belt",
      "widget_redirect_to": "/lite/live-dispatch",
      "placement": "HOME",
      "sequence": 3,
      "territory": "ALL",
      "module": "LITE",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "lite-dispatch-1",
          "title": "HAATZA Lite Express Delivery Hub",
          "subtitle": "Automated packing and rapid 10-minute neighbourhood dispatch",
          "badge": "HAATZA LITE",
          "imageUrl": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Learn More",
          "button_text": "Learn More",
          "redirectType": "CAMPAIGN",
          "redirect_type": "CAMPAIGN",
          "redirectUrl": "/lite/delivery-info",
          "redirect_url": "/lite/delivery-info"
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W020",
      "widget_name": "Promo Banner",
      "widget_redirect_to": "/lite/promotions",
      "placement": "HOME",
      "sequence": 4,
      "territory": "ALL",
      "module": "LITE",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "lite-promo-1",
          "title": "Mid-Week Grocery Discounts",
          "subtitle": "Flat 20% off on all cooking oils, dals, and flours",
          "badge": "Mid-Week Special",
          "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Save Now",
          "button_text": "Save Now",
          "redirectType": "CAMPAIGN",
          "redirect_type": "CAMPAIGN",
          "redirectUrl": "/lite/offers",
          "redirect_url": "/lite/offers"
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W021",
      "widget_name": "Offer Banner",
      "widget_redirect_to": "/lite/offers",
      "placement": "HOME",
      "sequence": 5,
      "territory": "ALL",
      "module": "LITE",
      "warehouse_id": "",
      "category_id": "",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "BANNER",
      "items": [
        {
          "id": "lite-offer-1",
          "title": "Free Delivery on Orders Above ₹199",
          "subtitle": "No minimum service charge or surge pricing for members",
          "badge": "Free Delivery",
          "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
          "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
          "buttonText": "Shop Essentials",
          "button_text": "Shop Essentials",
          "redirectType": "CAMPAIGN",
          "redirect_type": "CAMPAIGN",
          "redirectUrl": "/lite/offers",
          "redirect_url": "/lite/offers"
        }
      ],
      "total_items": 1
    },
    {
      "widget_id": "W022",
      "widget_name": "Fresh Fruits and Daily Greens",
      "widget_redirect_to": "/lite/category/fruits-greens",
      "placement": "HOME",
      "sequence": 6,
      "territory": "ALL",
      "module": "LITE",
      "warehouse_id": "",
      "category_id": "c4000000-0000-4000-8000-000000000004",
      "product_id": "",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "status": true,
      "widget_type": "PRODUCT_LIST",
      "items": [
        {
          "productId": "d1000000-0000-4000-8000-000000000018",
          "product_id": "d1000000-0000-4000-8000-000000000018",
          "productName": "Fresh Farm Green Spinach (Palak) 250g",
          "product_name": "Fresh Farm Green Spinach (Palak) 250g",
          "description": "Crisp pesticide-free washed farm fresh green spinach",
          "productImage": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c4000000-0000-4000-8000-000000000004",
          "category_id": "c4000000-0000-4000-8000-000000000004",
          "categoryName": "Grocery & Daily Essentials",
          "category_name": "Grocery & Daily Essentials",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Farm Fresh",
          "price": 24,
          "mrp": 30,
          "discount": 20,
          "onSalePrice": 24,
          "onsale_price": 24,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "Fresh Daily",
          "isHaatzaLite": true,
          "is_haatzalite": true,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/lite/products/d1000000-0000-4000-8000-000000000018",
          "redirect_url": "/lite/products/d1000000-0000-4000-8000-000000000018",
          "id": "d1000000-0000-4000-8000-000000000018",
          "name": "Fresh Farm Green Spinach (Palak) 250g",
          "mainImage": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 24,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 20
        },
        {
          "productId": "d1000000-0000-4000-8000-000000000019",
          "product_id": "d1000000-0000-4000-8000-000000000019",
          "productName": "Farm Fresh Organic Robusta Bananas 1kg",
          "product_name": "Farm Fresh Organic Robusta Bananas 1kg",
          "description": "Naturally ripened nutrient-rich organic robusta bananas",
          "productImage": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
          "product_image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
          "categoryId": "c4000000-0000-4000-8000-000000000004",
          "category_id": "c4000000-0000-4000-8000-000000000004",
          "categoryName": "Grocery & Daily Essentials",
          "category_name": "Grocery & Daily Essentials",
          "subcategoryId": "",
          "subcategory_id": "",
          "subcategoryName": "",
          "subcategory_name": "",
          "brand": "Farm Fresh",
          "price": 51,
          "mrp": 60,
          "discount": 15,
          "onSalePrice": 51,
          "onsale_price": 51,
          "currency": "INR",
          "isAddToCart": true,
          "ribbon": "",
          "isHaatzaLite": true,
          "is_haatzalite": true,
          "haatzaVerified": true,
          "haatza_verified": true,
          "redirectType": "PRODUCT",
          "redirect_type": "PRODUCT",
          "redirectUrl": "/lite/products/d1000000-0000-4000-8000-000000000019",
          "redirect_url": "/lite/products/d1000000-0000-4000-8000-000000000019",
          "id": "d1000000-0000-4000-8000-000000000019",
          "name": "Farm Fresh Organic Robusta Bananas 1kg",
          "mainImage": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
          "productCoverImage": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
          "sku": "SKU-D1000000",
          "shippingWeight": 0.5,
          "status": true,
          "productOptions": [],
          "productType": "PHYSICAL",
          "manageVariants": false,
          "trackInventory": false,
          "variantPrice": 51,
          "productSpecification": {},
          "influencerBranding": false,
          "activeAdd": false,
          "promotionalImages": [
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80"
          ],
          "images": [
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80"
          ],
          "rating": 4.5,
          "reviewCount": 128,
          "inStock": true,
          "stock": 100,
          "discountPercentage": 15
        }
      ],
      "total_items": 2
    }
  ]
}
```

---

## 3. Common Response Field Reference

### Top-Level Envelope Keys

| Field | Data Type | Description |
|---|---|---|
| `success` | `boolean` | `true` when the query completed successfully; `false` on client error. |
| `module` | `string` | Module processed (`HAATZA` or `LITE`). |
| `placement` | `string` | Layout placement resolved (`HOME`). |
| `territory` | `string` | Territory filter applied (`56` or `ALL`). |
| `warehouseId` | `string` | Warehouse ID applied for warehouse-isolated inventory. |
| `total_widgets` | `integer` | Total number of layout widget containers returned. |
| `data` | `array` | Ordered array of widget objects. |

### Widget Object Keys

| Field | Data Type | Description |
|---|---|---|
| `widget_id` | `string` | Primary identifier (`W001` through `W023`). |
| `widget_name` | `string` | Human-readable title of the section (e.g., `Hero Banner`, `Everyday Essentials`). |
| `widget_type` | `string` | Container category: `BANNER` or `SHELF`. |
| `widget_redirect_to` | `string` | Deep-link / route destination (e.g. `/offers/festive-sale`, `/lite/offers`). |
| `placement` | `string` | Layout context (`HOME`). |
| `sequence` | `integer` | Display sequence index (1–16 for HAATZA, 1–7 for LITE). |
| `territory` | `string` | Target territory (`ALL` or 2-digit PIN prefix). |
| `module` | `string` | Owner module (`HAATZA` or `LITE`). |
| `warehouse_id` | `string` | Targeted dark store warehouse ID, or empty string for universal widgets. |
| `category_id` | `string` | Category UUID targeting, or empty string. |
| `product_id` | `string` | Specific product targeting UUID, or empty string. |
| `redirect_category_id` | `string` | Redirect category UUID, or empty string. |
| `redirect_product_id` | `string` | Redirect product UUID, or empty string. |
| `status` | `boolean` | Widget active status (`true`). |
| `items` | `array` | Populated array of banner or product items. |
| `total_items` | `integer` | Count of items returned in the `items` array. |

---

## 4. Filtering Mechanics

### Module Isolation
* `module=HAATZA` evaluates only widgets where `module = 'HAATZA'` (`W001`–`W016`). LITE widgets (`W017`–`W023`) can never appear in a HAATZA response.
* `module=LITE` evaluates only widgets where `module = 'LITE'` (`W017`–`W023`). HAATZA widgets can never appear in a LITE response.

### Category Filtering (`categoryId`)
* **Accepts:** String representing a Category UUID.
* **Validation Behavior:** Does not perform strict category existence validation against a master table. A non-matching category ID does **not** return HTTP 400.
* **Banner Preservation:** All promotional and layout banner widgets have an empty `category_id` (`""`), ensuring that hero, promo, and offer banners are always retained regardless of the selected category filter.
* **Shelves Handling:**
  - In HAATZA, all 16 widget containers are preserved in the response. If a product shelf does not have items matching the requested `categoryId`, it returns `items: []` and `total_items: 0` to maintain layout stability.
  - In LITE, widgets configured specifically for a category (e.g. `W018` and `W022` with `c4000000-0000-4000-8000-000000000004`) match the filter; widgets with a conflicting non-empty category (e.g. `W023` with `c3000000-0000-4000-8000-000000000003`) are excluded.

### Warehouse Filtering (`warehouseId`)
* **Accepts:** String representing a warehouse identifier (e.g. `WAREHOUSE001`).
* **Validation Behavior:** Does not perform strict warehouse existence validation. A non-existent warehouse ID does **not** return HTTP 400.
* **Eligibility:** Standard widgets configured with `warehouse_id = ''` or `'ALL'` are returned universally across all warehouses.

### Territory Filtering (`territory`)
* **Accepts:** Two-digit PIN prefix corresponding to one of the 28 Indian States (e.g. `56` for Karnataka, `11` for Delhi) or `ALL`.
* **Validation Behavior:** Strictly validated against the official postal circle map. Any invalid prefix triggers an HTTP 400 Bad Request error.

---

## 5. Widget Sequence Ordering

The backend guarantees ordering at both the API and database levels:
1. **API Ordering:** Result sets are ordered deterministically by:
   ```typescript
   orderBy: [
     { module: 'asc' },
     { sequence: 'asc' },
     { widgetId: 'asc' }
   ]
   ```
2. **HAATZA Sequence:** Widgets `W001` through `W016` run monotonically with `sequence` 1 through 16.
3. **LITE Sequence:** Widgets `W017` through `W023` run monotonically with `sequence` 1 through 7.
4. **Physical Database Ordering:** The PostgreSQL table has been organized using `CLUSTER public.dashboard USING dashboard_pkey;`, ensuring physical sequential ordering on disk.

---

## 6. How Product and Banner Items Are Populated

* **Banner Widgets (`widget_type: BANNER`):**
  Banner widgets (e.g. `W001`, `W002`, `W005`, `W010`, `W011`, `W017`, `W019`, `W020`, `W021`) pull directly from the verified `items` JSON array stored in the database. Each item contains banner imagery, titles, subtitles, badges, and deep-link routing actions.
* **Product Shelves (`widget_type: SHELF`):**
  Product shelves (e.g. `W004`, `W006`, `W009`, `W012`, `W018`, `W022`, `W023`) pull product cards containing MRP, selling price, discounts, inventory levels, ratings, and image URLs. When a category filter is active, items matching the category are preserved; empty shelves safely emit `items: []` and `total_items: 0`.

---

## 7. Actual Failure Responses

HTTP 400 Bad Request responses are strictly returned for invalid or missing required parameters:

### 1. Missing `module` Query Parameter (`400 Bad Request`)
```http
GET /api/dashboard
```
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "module",
      "message": "module is required (e.g. HAATZA or LITE)"
    }
  ]
}
```

### 2. Invalid `module` Query Parameter (`400 Bad Request`)
```http
GET /api/dashboard?module=UNKNOWN
```
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "module",
      "message": "Invalid module. Must be HAATZA or LITE"
    }
  ]
}
```

### 3. Deprecated `SHOPPING` Module (`400 Bad Request`)
```http
GET /api/dashboard?module=SHOPPING
```
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "module",
      "message": "The SHOPPING module has been deprecated and migrated to HAATZA. Please use module=HAATZA."
    }
  ]
}
```

### 4. Invalid `territory` PIN Prefix (`400 Bad Request`)
```http
GET /api/dashboard?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=99&placement=DESKTOP
```
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "territory",
      "message": "territory must be exactly 2 digits. Received: '99'"
    }
  ]
}
```

### 5. Missing `placement` Query Parameter (`400 Bad Request`)
```http
GET /api/dashboard?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=56
```
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "placement",
      "message": "placement is required. Allowed values: 'DESKTOP', 'MOBILE'"
    }
  ]
}
```

### 6. Invalid or Lowercase `placement` Query Parameter (`400 Bad Request`)
```http
GET /api/dashboard?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=56&placement=desktop
```
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "placement",
      "message": "placement must be either 'DESKTOP' or 'MOBILE'. Received: 'desktop'"
    }
  ]
}
```

> **Note on Non-Matching Filter Values:** Unrecognized or non-matching `categoryId` or `warehouseId` query parameters do **not** trigger HTTP 400 errors. The backend handles them gracefully by returning unassigned widgets/banners and empty item shelves (`items: []`, `total_items: 0`).
